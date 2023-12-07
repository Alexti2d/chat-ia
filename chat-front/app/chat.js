const TextBoxChat = ({msg, usr}) => {
      
      var id = msg.timeSent.replace(/ /g, '');
      test(id, msg)
      if (msg.username === usr) {
        
        return (
            <div>
            <div
              className="chat chat-end chat-bubble-secondary"
              key={id}
            >
              <div className="chat-header">{msg.username}</div>
              <div id={id} value="false" className="chat-bubble">{msg.content}</div>
            </div>
            <div className="row">
              <button className="p-1" onClick={() => traduction(id, msg.content, "english")}>🇬🇧</button>
              <button className="p-1" onClick={() => traduction(id, msg.content, "francais")}>🇫🇷</button>
            </div>
            </div>
          );   
      } else {
        return (
          <div>
            {proposition(msg)}
            <div className="chat chat-start" key={id}>
              <div className="chat-header">{msg.username}</div>
              <div id={id} className="chat-bubble">{msg.content}</div>
            </div>
              <button className="p-1" onClick={() => traduction(id, msg.content, "english")}>🇬🇧</button>
              <button className="p-1" onClick={() => traduction(id, msg.content, "francais")}>🇫🇷</button>
          </div>
        );
      }
  }
  const proposition = (msg) => {
    let body = {
      n: 1,
      max_context_length: 1024,
      max_length: 40,
      rep_pen: 1.1,
      temperature: 0.7,
      top_p: 0.5,
      top_k: 0,
      top_a: 0.75,
      typical: 0.19,
      tfs: 0.97,
      rep_pen_range: 1024,
      rep_pen_slope: 0.7,
      sampler_order: [6, 5, 4, 3, 2, 1, 0],
      prompt:
      `[The following is an interesting chat message log between You and Friends.]\n\nYou: Hi.\nFriends: Hello.\nYou: give me a list two suggested answers separated by commas, hello how are you?\nFriends: Well, I'm doing good\nYou: give me a list of two suggested answers separated by commas, ${msg}\nFriends:"`,
      quiet: true,
      stop_sequence: ["You:", "\nYou ", "\nKoboldAI: "],
      use_default_badwordsids: true, 
    };
    fetch("http://localhost:5001/api/v1/generate", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        let res = data.results[0].text.substring(0, data.results[0].text.length - 7);
        let tabRes = res.split(',');
        let proposition1 = document.getElementById("proposition1");
        let proposition2 = document.getElementById("proposition2");
        proposition1.value = tabRes[0];
        proposition2.value = tabRes[1];
        console.log(res.split(','))

      });
  }
  const test = (id, msg) => {
    let body = {
      n: 1,
      max_context_length: 1024,
      max_length: 1,
      rep_pen: 1.1,
      temperature: 0.7,
      top_p: 0.5,
      top_k: 0,
      top_a: 0.75,
      typical: 0.19,
      tfs: 0.97,
      rep_pen_range: 1024,
      rep_pen_slope: 0.7,
      sampler_order: [6, 5, 4, 3, 2, 1, 0],
      prompt:
      `[The following is an interesting chat message log between You and IA.]\n\nYou: true or false? ${msg} \nIA:"`,
      quiet: true,
      stop_sequence: ["You:", "\nYou ", "\nKoboldAI: "],
      use_default_badwordsids: true, 
    };
    // setTimeout(function = () => {
    fetch("http://localhost:5001/api/v1/generate", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        let res = data.results[0].text;
        let affichage = document.getElementById(id);
        if (res == "true") {
          affichage.className = "chat-bubble green";
        }
        else if(res == "false") {
          affichage.className = "chat-bubble red";
        }
      });
    }
  
  const traduction = (id, msg, lang) => {
    console.log(msg)
    let body = {
      n: 1,
      max_context_length: 1024,
      max_length: 40,
      rep_pen: 1.1,
      temperature: 0.7,
      top_p: 0.5,
      top_k: 0,
      top_a: 0.75,
      typical: 0.19,
      tfs: 0.97,
      rep_pen_range: 1024,
      rep_pen_slope: 0.7,
      sampler_order: [6, 5, 4, 3, 2, 1, 0],
      prompt:
      `[The following is an interesting log of translation messages between you and the Translator.]\n\nYou: Hi.\nTranslator: Hello.\nYou: translate in ${lang} \"${msg}\"\nTranslator:`,
      quiet: true,
      stop_sequence: ["You:", "\nYou ", "\nKoboldAI: "],
      use_default_badwordsids: true, 
    };
    fetch("http://localhost:5001/api/v1/generate", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        let res = data.results[0].text;
        let affichage = document.getElementById(id);
        affichage.innerText = "Traduction : " + res.substring(0, res.length - 4);
        console.log(res.substring(0, res.length - 4));
      });
  };
  export default TextBoxChat;