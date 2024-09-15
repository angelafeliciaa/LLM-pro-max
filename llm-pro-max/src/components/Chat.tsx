/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
  useRef,
} from "react";
import { BiUser, BiSend, BiSolidUserCircle } from "react-icons/bi";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";
import { CohereClient } from "cohere-ai";
import Markdown from "react-markdown";

function App() {
  const [text, setText] = useState("");
  const [chat, setChat] = useState([{}]);
  const [gitHubLink, setGitHubLink] = useState("");
  const [responseText, setResponseText] = useState("");
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const allChats = useRef<HTMLDivElement>(null);
  const emptyChat = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialMessage = {
      from: "LLM Pro Max",
      isText: true,
      text: "Hello, I'm LLM Pro Max. I can help you with your coding questions. Please provide me with the link to your GitHub repository.",
    };

    setChat([initialMessage]);
  }, []);

  useEffect(() => {
    if (allChats.current) {
      allChats.current.scrollTop = allChats.current.scrollHeight;
    }
  }, [chat]);

  const cohere = new CohereClient({
    token: import.meta.env.VITE_COHERE_API_KEY,
  });

  const toggleSidebar = useCallback(() => {
    setIsShowSidebar((prev) => !prev);
  }, []);

  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (!text) return;

    if (text.startsWith("http") && text.includes("github")) { 
      setGitHubLink(text);
      setChat((prev) => [...prev, { from: "You", text: text }]);
      emptyChat.current.style.display = "none";
      setText("");

      // Get the graph from the python script
      fetch(`http://localhost:5000/getGraph?repo_url=${text}`)
        .then((response) => response.json())
        .then(() => {
          setChat((prev) => [
            ...prev,
            {
              from: "LLM Pro Max",
              isText: true,
              text: `I have successfully extracted the code context from the GitHub repository. Here's a graphical visualization of the codebase.`,
            },
          ]);
          setChat((prev) => [
            ...prev,
            {
              from: "LLM Pro Max",
              isText: false,
              text: `<iframe src="http://127.0.0.1:5000/outputs/graph.html" frameborder="0"></iframe> <br><br> <a href="http://127.0.0.1:5000/outputs/graph.html" target="_blank"><b>Open in new tab</b></a>`,
            },
          ]);
        })
        .catch((error) => console.error(error));
    } else {
      setChat((prev) => [...prev, { from: "You", text }]);
      setText("");
      const prompt = text;
      const response = await cohere.chat({
        model: "command-r-08-2024",
        // message: prompt,
        message: `Extract relevant coding function names from the following string: "${prompt}" and return as a json object with key "functions"`,
        responseFormat: { type: "json_object" },
      });

      if (JSON.parse(response.text).functions.length === 0) {
        fetch(`http://127.0.0.1:8080/chat/?repo_url=${gitHubLink}&query=${text}`)
          .then((response) => response.json())
          .then((data) => {
            setChat((prev) => [
              ...prev,
              { from: "LLM Pro Max", text: data.answer },
            ]);
            setText("");
            return;
          })
          .catch((error) => console.error(error));
      } else {
          fetch(
            `http://localhost:8000/required_code?function_names=${response.text}`,
          )
            .then((response) => response.json())
            .then(async (data) => {
              const finalResponse = await cohere.chatStream({
                model: "command-r-08-2024",
                message: `${prompt} Use the following code context to answer the question: ${data}`,
              });

              console.log(
                `${prompt} Use the following code context to answer the question: ${data}`,
              );

              for await (const message of finalResponse) {
                if (message.eventType === "text-generation") {
                  // append each text to the response as it comes
                  // responseText += message.text;
                  // add the response as it comes in using setChat
                  setResponseText((prev) => prev + message.text);
                }
              }
            })
            .catch((error) => console.error(error));

            setChat((prev) => [
              ...prev,
              { from: "LLM Pro Max", isText: true, text: responseText },
            ]);
            setResponseText("");
      }
    }
  };

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsShowSidebar(window.innerWidth <= 640);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="container-chat">
        <section className={`sidebar ${isShowSidebar ? "open" : ""}`}>
          <div className="sidebar-info">
            <div className="sidebar-info-upgrade">
              <BiUser size={20} />
              <p>Upgrade plan</p>
            </div>
            <div className="sidebar-info-user">
              <BiSolidUserCircle size={20} />
              <p>User</p>
            </div>
          </div>
        </section>

        <section className="main">
          <div className="empty-chat-container" ref={emptyChat}>
            <img src="/logo.png" width={75} height={75} alt="ChatGPT" />
            <h1>How can I help you today?</h1>
          </div>

          <div className="all-chats" ref={allChats}>
            {chat.map((chat, index) => (
              
              <div key={index} className="chat-box">
                <div
                  className={
                    chat.from === "You"
                      ? "chat-message you"
                      : "chat-message llm"
                  }
                >
                  {chat.isText && <Markdown>{chat.text}</Markdown>}
                  {!chat.isText && (
                    <div
                      className="graph-container"
                      dangerouslySetInnerHTML={{ __html: chat.text }}
                    ></div>
                  )}
                </div>
              </div>
            ))}
            {responseText && (
              <div className="chat-box">
                <div className="chat-message llm">
                  <Markdown>{responseText}</Markdown>
                </div>
              </div>
            )}
          </div>

          {isShowSidebar ? (
            <MdOutlineArrowRight
              className="burger"
              size={28.8}
              onClick={toggleSidebar}
            />
          ) : (
            <MdOutlineArrowLeft
              className="burger"
              size={28.8}
              onClick={toggleSidebar}
            />
          )}
          <div className="main-header"></div>
          <div className="main-bottom">
            <form className="form-container" onSubmit={submitHandler}>
              <input
                type="text"
                placeholder="Send a message."
                spellCheck="false"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button type="submit">
                <BiSend size={20} />
              </button>
            </form>
            <p>
              LLM Pro Max can make mistakes. Consider checking important
              information.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
