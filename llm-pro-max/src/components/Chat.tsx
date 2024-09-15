import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { BiPlus, BiUser, BiSend, BiSolidUserCircle } from "react-icons/bi";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";
import { CohereClient } from "cohere-ai";
import Markdown from "react-markdown";

function App() {
  const [text, setText] = useState("");
  const [chat, setChat] = useState([]);
  const [response, setResponse] = useState("");
  const [errorText, setErrorText] = useState("");
  const [isShowSidebar, setIsShowSidebar] = useState(false);

  const cohere = new CohereClient({
    token: import.meta.env.VITE_COHERE_API_KEY,
  });

  const toggleSidebar = useCallback(() => {
    setIsShowSidebar((prev) => !prev);
  }, []);

  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (!text) return;

    setErrorText("");

    const prompt = text;

    const response = await cohere.chat({
      model: "command-r-08-2024",
      // message: prompt,
      message: `Extract relevant coding function names from the following string: "${prompt}" and return as a json object with key "functions"`,
      responseFormat: { type: "json_object" },
    });

    console.log(response.text);

    fetch(`http://localhost:8000/required_code?function_names=${response.text}`)
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

    // let responseText = "";

    // for await (const message of response) {
    //   if (message.eventType === "text-generation") {
    //     // append each text to the response as it comes
    //     responseText += message.text;
    //     // setResponse((prev) => prev + message.text);
    //   }
    // }
  };

  //     const options = {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: import.meta.env.VITE_AUTH_TOKEN,
  //       },
  //       body: JSON.stringify({
  //         message: text,
  //       }),
  //     };

  //     try {
  //       const response = await fetch(
  //         `${import.meta.env.VITE_API_URL}/api/completions`,
  //         options,
  //       );

  //       if (response.status === 429) {
  //         return setErrorText("Too many requests, please try again later.");
  //       }

  //       const data = await response.json();

  //       if (data.error) {
  //         setErrorText(data.error.message);
  //         setText("");
  //       } else {
  //         setErrorText("");
  //       }

  //       if (!data.error) {
  //         setErrorText("");
  //         setMessage(data.choices[0].message);
  //         setTimeout(() => {
  //           scrollToLastItem.current?.lastElementChild?.scrollIntoView({
  //             behavior: "smooth",
  //           });
  //         }, 1);
  //         setTimeout(() => {
  //           setText("");
  //         }, 2);
  //       }
  //     } catch (e) {
  //       setErrorText(e.message);
  //       console.error(e);
  //     } finally {
  //       setIsResponseLoading(false);
  //     }
  //   };

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
          <div className="empty-chat-container">
            <img src="/logo.png" width={45} height={45} alt="ChatGPT" />
            <h1>LLM Pro Max</h1>
            <h3>How can I help you today?</h3>
          </div>

          <div className="all-chats">
            {chat.map((chat, index) => (
              <div key={index} className="chat-box">
                <div className="chat-message">
                  <Markdown>{chat}</Markdown>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-container">
            <div className="chat-box">
              <div className="chat-message">
                <Markdown>{response}</Markdown>
              </div>
            </div>
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
