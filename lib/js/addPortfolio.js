function selectCat(selected) {
  $.post('/api/getSubcats', {category: selected} , (response) => {
    let res = response.res;
    $("#sub-selection ul li").remove();
    for (let i = 0; i < res.length; i++) {
      let cat = res[i];
      let fa = cat.subcat;
      let en = cat.en;
      if (en == 'all') continue;


      let element = `
      <li>
        <span>${fa}</span>
        <input name="selectedSubcat" value="${en}" type="radio">
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

  $.post('/api/getUsers', (response) => {
    let res = response.res;
    for (let i = 0; i < res.length; i++) {
      let user = res[i];
      let name = user.name;
      let username = user.username;

      let element = `
      <li>
        <span>${name}</span>
        <input name="selectedArtist" value="${username}" type="radio">
      </li>`;
      $("#art-selection ul").append(element);
    }
  });

});
