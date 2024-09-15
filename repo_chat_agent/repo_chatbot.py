import os
import logging
from typing import List, Tuple

from langchain_community.document_loaders import GitLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_cohere import CohereEmbeddings
from langchain_community.llms import Cohere
from langchain.retrievers import ContextualCompressionRetriever
from langchain_cohere import CohereRerank
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# # Set up logging
# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)

# Set your API keys
os.environ["COHERE_API_KEY"] = "fVKwe3yLSSx4DQb7Bek6E9VvHbdHFKbocTa70hMI"  # Replace with your actual API key

# GitHub repo details
repo_url = "https://github.com/codegen-sh/Loop-Labyrinth-Analysis.git"
repo_path = "./repo_path"

# Load GitHub repository
loader = GitLoader(
    clone_url=repo_url,
    repo_path=repo_path,
    branch="main"
)
documents = loader.load()

# Split documents
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
splits = text_splitter.split_documents(documents)

# Create embeddings and vector store
embeddings = CohereEmbeddings(
    model="embed-english-v2.0"
)
vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings)

# Create base retriever
base_retriever = vectorstore.as_retriever(search_kwargs={"k": 10})

# Create reranker for contextual compression
reranker = CohereRerank(
     model="rerank-english-v2.0",
)

# Create contextual compression retriever
compression_retriever = ContextualCompressionRetriever(
    base_compressor=reranker,
    base_retriever=base_retriever
)

# Define query expansion function
def expand_query(query: str) -> List[str]:
    llm = Cohere(model="command-r-08-2024")
    prompt = f"Generate 3 alternative phrasings for the following query:\n\nQuery: {query}\n\nAlternative phrasings:"
    response = llm.generate([prompt])
    
    # logger.debug(f"Cohere API response: {response}")
    
    expanded_queries = [query]  # Start with the original query
    
    try:
        if hasattr(response, 'generations') and isinstance(response.generations, list):
            for generation in response.generations:
                if hasattr(generation, 'text'):
                    expanded_queries.extend(generation.text.strip().split('\n'))
        elif isinstance(response, list):
            for item in response:
                if isinstance(item, str):
                    expanded_queries.extend(item.strip().split('\n'))
                elif hasattr(item, 'text'):
                    expanded_queries.extend(item.text.strip().split('\n'))
    except Exception as e:
        print(f"Error in expand_query: {str(e)}")
    
    # Remove any empty strings and ensure uniqueness
    expanded_queries = list(set([q.strip() for q in expanded_queries if q.strip()]))
    
    # Ensure we have at most 4 queries (original + 3 alternatives)
    return expanded_queries[:4]

# Define retrieval function with query expansion and re-ranking
def retrieve_with_expansion_and_reranking(query: str, retriever: ContextualCompressionRetriever) -> List[Tuple[str, float]]:
    expanded_queries = expand_query(query)
    all_docs = []
    for expanded_query in expanded_queries:
        docs = retriever.get_relevant_documents(expanded_query)
        all_docs.extend(docs)
    
    # Remove duplicates based on content and sort by relevance score
    unique_docs = []
    seen_content = set()
    for doc in all_docs:
        if doc.page_content not in seen_content:
            seen_content.add(doc.page_content)
            unique_docs.append(doc)
    
    sorted_docs = sorted(unique_docs, key=lambda x: x.metadata.get('relevance_score', 0), reverse=True)
    
    return [(doc.page_content, doc.metadata.get('relevance_score', 0)) for doc in sorted_docs[:5]]

llm = Cohere(model="command-r-08-2024")
qa_prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="Answer the following question based on the given context:\n\nContext: {context}\n\nQuestion: {question}\n\nAnswer:",
)
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=compression_retriever,
    chain_type="stuff",
    return_source_documents=True,
    chain_type_kwargs={"prompt": qa_prompt}
)

# Main chat loop
def chat():
    print("Welcome to the GitHub Repo Chatbot! Ask me anything about the repository.")
    print("Type 'quit' to exit.")
    
    while True:
        query = input("\nYou: ")
        if query.lower() == 'quit':
            break
        
        try:
            # Retrieve relevant documents with expansion and re-ranking
            relevant_docs = retrieve_with_expansion_and_reranking(query, compression_retriever)
            
            # Generate answer
            result = qa_chain({"query": query})
            answer = result['result']
            print(*result)
            
            print("\nChatbot: " + answer)
            
            print()
        except Exception as e:
            print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    chat()