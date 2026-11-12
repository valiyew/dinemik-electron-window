const addWindowBtn = document.getElementById("addWindowBtn");

let countNewWindow = 0;

window.countAPI.onCountUpdate((count) => {
  countNewWindow = count;
});

addWindowBtn.addEventListener("click", () => {
  countNewWindow++;
  window.countIncremementAPI.incrementCounter(countNewWindow);
});

const renderHtmlContent = (value) => {
  document.body.innerHTML = value.map(
    (element) => `
          <div>
            <p>${element.title} ning ma'lumotlari</p>
            <ul>
              <li>ID: ${element.id}</li>
              <li>Bounds: ${JSON.stringify(element.bounds)}</li>
              <li>Positions: ${JSON.stringify(element.position)}</li>
              <li>Size: ${JSON.stringify(element.size)}</li>
              <li>Minimized: ${JSON.stringify(element.minimized)}</li>
              <li>Fullscreen: ${JSON.stringify(element.fullscreen)}</li>
            </ul>
          </div>
        `,
  );
};

window.displayWindowAPI.displayWindow((value) => {
  if (value === "displayWindow") {
    document.body.innerHTML = `
    <div>
      <p>Bu faqat ikkinchi window uchun!</p>
    </div>
  `;

    window.windowMoveAPI.winDatas((value) => {
      renderHtmlContent(value);
    });
  }
});

// window.dinemikWindowRenderHtmlAPI.dinemikWindowRender((value) => {
//   document.body.innerHTML = `
//     <div>
//       <p>Yaratilgan winowni</p>
//     </div>
//   `;
// });
