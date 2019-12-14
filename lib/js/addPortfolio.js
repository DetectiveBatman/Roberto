function selectCat(selected) {
  $.post('/api/getSubcats', {category: selected} , (response) => {
    let res = response.res;
    for (let i = 0; i < res.length; i++) {
      let cat = res[i];
      let fa = cat.subcat;
      let en = cat.en;
      if (en == 'all') continue;

      $("#sub-selection ul li").remove();

      let element = `
      <li>
        <span>${fa}</span>
        <input name="selectedSubcat" value="${en}" type="radio" onClick="selectCat('${en}')">
      </li>`;
      $("#sub-selection ul").append(element);
    }
  });

}

$(document).ready(() => {
  $.post('/api/getCategories', (response) => {
    let res = response.res;
    for (let i = 0; i < res.length; i++) {
      let cat = res[i];
      let fa = cat.fa;
      let en = cat.en;

      let element = `
      <li>
        <span>${fa}</span>
        <input name="selectedCategory" value="${en}" type="radio" onClick="selectCat('${en}')">
      </li>`;
      $("#cat-selection ul").append(element);
    }
  });

});
