const returnSelection = () => {
  return new Promise((resolve, reject) => {
    if (window.getSelection) {
      resolve(window.getSelection().toString());
    } else if (document.getSelection) {
      resolve(document.getSelection().toString());
    } else if (document.selection) {
      resolve(document.selection.createRange().text.toString());
    } else reject();
  });
};

chrome.runtime.onMessage.addListener(
  async (request, sender, sendResponse) => {
    const { type } = request;
    if (type === "LOAD") {
      try {
        const selection = await returnSelection();
        sendResponse(selection);
      } catch (e) {
        sendResponse();
      }
    } else {
      const container = document.createElement("div");
      const content = document.createElement("div");
      const contentImage = document.createElement("div");
      const paragraph = document.createElement("p");
      const image = document.createElement("img");
      const imageUrl = request.resultDetect === 'Fake' ? chrome.runtime.getURL('assets/icons/fake-news.jpg') : chrome.runtime.getURL('assets/icons/true-news.jpg');
      image.src = imageUrl;
      image.style.width = "40px";
      paragraph.textContent = request.resultDetect === 'Fake' ? 'Nghi ngờ đây là tin giả' : 'Đây là tin thật';
      paragraph.style.margin = "0px";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.justifyContent = "center";
      container.style.alignItems = "center";
      container.style.width = "300px";
      container.style.height = "200px";
      container.style.margin = "auto";
      container.style.backgroundColor = request.resultDetect === 'Fake' ? "rgb(223, 79, 79)" : "rgb(77, 121, 255)";
      container.style.borderRadius = "10px";
      container.style.position = "absolute";
      content.style.textAlign = "center";
      content.style.margin = "0px";
      content.style.fontSize = "23px";
      content.style.color = "rgb(255, 255, 128)";
      container.style.top = `${window.getSelection().getRangeAt(0).getBoundingClientRect().top + window.scrollY + 40}px`;
      container.style.left = `${window.getSelection().getRangeAt(0).getBoundingClientRect().left + window.scrollX}px`;
      contentImage.style.marginRight = "4px";
      contentImage.appendChild(image);
      content.appendChild(paragraph);
      container.appendChild(contentImage);
      container.appendChild(content);
      document.body.appendChild(container);
      if (request.greeting === "hello")
        sendResponse({ farewell: "goodbye" });
    }
  }
);