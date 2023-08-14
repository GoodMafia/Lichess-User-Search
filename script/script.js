const searchInp = document.querySelector(".search");
const searchBtn = document.querySelector(".searchButton");
const form = document.querySelector(".searchForm");
const main = document.querySelector("main");

function addInfo(
  username,
  registerDate,
  allGames,
  ratedGames,
  wonGames,
  blitzRating,
  bulletRating,
  rapidRating,
  classicalRating
) {
  main.innerHTML = `
        <p class="infoTitle">Информация о профиле ${username}</p>
        <div class="flex-parent">
        <div class="first-block">
            <p class="string">Дата регистрации - ${registerDate}</p>
            <p class="string">Количество игр - ${allGames}</p>
            <p class="string">Количесвто рейтинговых игр - ${ratedGames}</p>
            <p class="string">Количество выигранных игр - ${wonGames}</p>
        </div>
        <div class="second-block">
            <p class="string">Blitz рейтинг - ${blitzRating}</p>
            <p class="string">Bullet рейтинг - ${bulletRating}</p>
            <p class="string">Rapid рейтинг - ${rapidRating}</p>
            <p class="string">Classical рейтинг - ${classicalRating}</p>
        </div>
        </div>
        <div class="lichessLogotype"><img src="img/images.jpeg"></div>`;
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  let value = searchInp.value;
  if (value.length > 21) {
    main.innerHTML = `<p class="error">ERROR: Длина никнейма ${value} превышает максимальное значение.</p><div class="lichessLogotype"><img src="img/images.jpeg"></div>`;
    searchInp.value = "";
    return false;
  } else if (value == "") {
    main.innerHTML = `<p class="error">ERROR: Вы ввели пустой никнейм. Пожалуйста повторите попытку.</p><div class="lichessLogotype"><img src="img/images.jpeg"></div>`;
    searchInp.value = "";
    return false;
  }
  fetch(`https://lichess.org/api/user/${value}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      main.innerHTML = "";
      if (data.error === "Not found") {
        main.innerHTML = `<p class="error">ERROR: User с никнеймом ${value} не найден.</p><div class="lichessLogotype"><img src="img/images.jpeg"></div>`;
        searchInp.value = "";
        return false;
      } else if (data.disabled == true) {
        main.innerHTML = `<p class="infoTitle" style="padding-top: 30px;">Информация о профиле ${data.username}</p><p class="string" style="text-align: center; padding-top: 10px;">Данный аккаунт закрыт</p><div class="lichessLogotype"><img src="img/images.jpeg"></div>`;
        searchInp.value = "";
        return false;
      }
      let timestamp = data.createdAt;
      let date = new Date(timestamp);
      let year = date.getUTCFullYear();
      let month = date.getUTCMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let day =
        date.getUTCDate() < 10 ? "0" + date.getUTCDate() : date.getUTCDate();
      let registerDate = `${day}.${month}.${year}`;
      addInfo(
        data.username,
        registerDate,
        data.count.all,
        data.count.rated,
        data.count.win,
        data.perfs.blitz.rating,
        data.perfs.bullet.rating,
        data.perfs.rapid.rating,
        data.perfs.classical.rating
      );
    });
});
