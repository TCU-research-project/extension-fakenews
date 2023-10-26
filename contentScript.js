const returnSelection = () => {
    return new Promise((resolve, reject) => {
        if (window.getSelection) {
            resolve(window.getSelection().toString())
        } else if (document.getSelection) {
            resolve(document.getSelection().toString())
        } else if (document.selection) {
            resolve(document.selection.createRange().text.toString())
        } else reject();
    })
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    const container = document.createElement("div");
		const content = document.createElement("div");
    const contentImage = document.createElement("div");
		const paragraph = document.createElement("p");
    const image = document.createElement("img");
    const imageUrl = chrome.runtime.getURL('assets/icons/fake-news.jpg')
    image.src = imageUrl;
    image.style.width = "40px";
		paragraph.textContent = "Nghi ngờ đây là tin giả";
		paragraph.style.margin = "0px"
		container.style.display = "flex";
    container.style.flexDirection = "column"
		container.style.justifyContent = "center";
		container.style.alignItems = "center";
		container.style.width = "300px"
		container.style.height = "200px";
		container.style.margin = "auto";
		container.style.backgroundColor = "rgb(77, 121, 255)";
		container.style.borderRadius = "10px";
		container.style.position = "absolute";
		content.style.textAlign = "center";
		content.style.margin = "0px";
    content.style.fontSize = "23px";
    content.style.color = "rgb(255, 255, 128)";
    container.style.top = `${window.getSelection().getRangeAt(0).getBoundingClientRect().top + window.scrollY + 40}px`;
    container.style.left = `${window.getSelection().getRangeAt(0).getBoundingClientRect().left + window.scrollX}px`;
		contentImage.style.marginRight = "4px";
    contentImage.appendChild(image)
    content.appendChild(paragraph);
    container.appendChild(contentImage);
    container.appendChild(content);
		document.body.appendChild(container);
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting === "hello")
      sendResponse({farewell: "goodbye"});
  }
);

// chrome.runtime.onMessage.addListener(async (request, sender, response) => {
// 	console.log(request, sender, response);
// 	response('Received message'+JSON.stringify("request"));
//     const { type, selectedText } = request
//     if (type === "LOAD") {
//         try {
//             const selection = await returnSelection()
//             response(selection)
//         } catch (e) {
//             response()
//         }
//     }
// })
