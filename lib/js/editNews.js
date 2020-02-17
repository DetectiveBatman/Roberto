$(document).ready(() => {
  $.post('/api/getNews', (response) => {
    let res = response.res;
    for (let i = 0; i < res.length; i++) {
      let cat = res[i];
      let fa = cat.title;
      let id = cat.id;

      let element = `
      <li>
        <span>${fa}</span>
        <input name="selectedCategory" value="${id}" type="radio">
      </li>`;
      $("#cat-selection ul").append(element);
    }
  });
});
