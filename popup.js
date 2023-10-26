document.addEventListener("DOMContentLoaded", async () => {

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const getActiveTab = async () => {
        const tabs = await chrome.tabs.query({
            currentWindow: true,
            active: true
        });
        return tabs[0];
    };

    const showPopup = async (answer) => {
        if (answer !== "CLOUDFLARE" && answer !== "ERROR") {
            try {
                let res = await answer.split("data:");
                try {
                    const detail = JSON.parse(res[0]).detail;
                    document.getElementById('output').style.opacity = 1;
                    document.getElementById('output').innerHTML = detail;
                    return;
                } catch (e) {
                    try {
                        res = res[1].trim();
                        if (res === "[DONE]") return;
                        answer = JSON.parse(res);
                        let final = answer.message.content.parts[0];
                        final = final.replace(/\n/g, '<br>');
                        document.getElementById('output').style.opacity = 1;
                        document.getElementById('output').innerHTML = final;
                    } catch (e) { }
                }
            } catch (e) {
                document.getElementById('output').style.opacity = 1;
                document.getElementById('output').innerHTML = "Something went wrong. Please try in a few minutes.";
            }

        } else if (answer === "CLOUDFLARE") {
            document.getElementById('input').style.opacity = 1;
            document.getElementById('input').innerHTML = 'You need to once visit <a target="_blank" href="https://chat.openai.com/chat">chat.openai.com</a> and check if the connection is secure. Redirecting...';
            await sleep(3000);
            chrome.tabs.create({ url: "https://chat.openai.com/chat" });
        } else {
            document.getElementById('output').style.opacity = 1;
            document.getElementById('output').innerHTML = 'Something went wrong. Are you logged in to <a target="_blank" href="https://chat.openai.com/chat">chat.openai.com</a>? Try logging out and logging in again.';
        }
        document.getElementById('output').style.opacity = 1;
        document.getElementById('output').innerHTML = 'hihi';
    };

    const getData = async (selection) => {
        if (!(selection?.length == 0)) {
            document.getElementById('input').style.opacity = 1;
            document.getElementById('input').innerHTML = "<p>" + selection + "</p>";
            document.getElementById('output').style.opacity = 1;
            document.getElementById('output').innerHTML = `
                <img src = "/assets/icons/fake-news.jpg" alt = "fake-news" width = "40">
                <p> Đây là fake news</p>
            `;
            // document.getElementById('output').innerHTML = `
            //     <img src = "/assets/icons/true-news.jpg" alt = "fake-news" width = "40">
            //     <p> Đây là true news</p>
            // `;


            // port.postMessage({ question: selection });
            // port.onMessage.addListener((msg) => showPopup(msg));
        } else {
            document.getElementById('input').style.opacity = 0.5;
            document.getElementById('input').innerHTML = "Vui lòng lựa chọn đoạn văn bản cần nhận diện";
        }
    };

    const getSelectedText = async () => {
        const activeTab = await getActiveTab();
        chrome.tabs.sendMessage(activeTab.id, { type: "LOAD" }, getData);
    };

    getSelectedText();

});