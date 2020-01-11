function deleteCat(id, en) {
  $.post("/api/deleteSubcat", {id: id, en: en}, (resp) => {
    if (resp.ok == true) {
      alert('انجام شد');
      $(`cat-${id}`).remove();
    } else {
      alert('ناموفق بود');
    }
  });
}
$(document).ready(() => {
  $.post('/api/getSubcats', (resp) => {
    if (resp.ok == 'true') {
      let categories = resp.res;
      for (let i = 0; i < categories.length; i++) {
        let category = categories[i];
        let id = category.id;
        let fa = category.subcat;
        let en = category.en;
        let element = `
        <li>
          <span>${fa}</span>
          <i class="fas fa-trash" id="cat-${id}" onClick="deleteCat(${id}, '${en}')"></i>
        </li>
        `;
        $("#categories-ul").append(element);
      }
    } else {
      alert('مشکلی بوجود آمده است');
    }
  });
});
