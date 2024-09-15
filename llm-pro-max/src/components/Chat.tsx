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
  const [isGitHub, setIsGitHub] = useState(false);
  const [response, setResponse] = useState("");
  const [errorText, setErrorText] = useState("");
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

    if (text.startsWith("https") && text.includes("github")) {
      setIsGitHub(true);
    }

    if (isGitHub) {
      setChat((prev) => [...prev, { from: "You", text: gitHubLink }]);
      emptyChat.current.style.display = "none";
      setText("");
      const gitHubLink = text;

      // Get the graph from the python script
      fetch(`http://localhost:8000/getGraph?repo_url=${gitHubLink}`)
        .then((response) => response.json())
        .then((data) => {
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
              text: `<iframe src="http://127.0.0.1:8000/outputs/graph.html" frameborder="0"></iframe> <br><br> <a href="http://127.0.0.1:8000/outputs/graph.html" target="_blank"><b>Open in new tab</b></a>`,
            },
          ]);

          setIsGitHub(false);
        })
        .catch((error) => console.error(error));
    }

    if (!isGitHub) {
      const prompt = text;
      const response = await cohere.chat({
        model: "command-r-08-2024",
        // message: prompt,
        message: `Extract relevant coding function names from the following string: "${prompt}" and return as a json object with key "functions"`,
        responseFormat: { type: "json_object" },
      });

      console.log(response.text);

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
              setResponse((prev) => prev + message.text);
            }
          }
        })
        .catch((error) => console.error(error));
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
            <img src="/logo.png" width={45} height={45} alt="ChatGPT" />
            <h1>LLM Pro Max</h1>
            <h3>How can I help you today?</h3>
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
                  <p className="role-title">{chat.from}</p>
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
            {errorText && <p className="errorText">{errorText}</p>}
            {errorText && <p id="errorTextHint"></p>}
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
