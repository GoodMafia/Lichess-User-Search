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
  classicalRating,
  lostGames,
  correspondenceRating
) {
  main.innerHTML = `
  <div class="user-info">
  <p class="infoTitle">Информация о профиле ${username}</p>
  <div class="flex-parent">
      <div class="info-block">
          <p class="info-item">Дата регистрации - ${registerDate}</p>
          <p class="info-item">Количество игр - ${allGames}</p>
          <p class="info-item">Количесвто рейтинговых игр - ${ratedGames}</p>
          <p class="info-item">Количество товарищеских игр - ${
            allGames - ratedGames
          }</p>
          <p class="info-item">Количество выигранных игр - ${wonGames}</p>
          <p class="info-item">Количество проигранных игр - ${lostGames}</p>
      </div>
      <div class="info-block">
          <p class="info-item">Blitz рейтинг - ${blitzRating}</p>
          <p class="info-item">Bullet рейтинг - ${bulletRating}</p>
          <p class="info-item">Rapid рейтинг - ${rapidRating}</p>
          <p class="info-item">Classical рейтинг - ${classicalRating}</p>
          <p class="info-item">Correspondence рейтинг - ${correspondenceRating}</p>
      </div>
  </div>
</div>`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let value = searchInp.value;
  if (value.length > 21) {
    main.innerHTML = `
    <main>
      <div class="error-message">
        <p class="error">ERROR: Длина никнейма ${value} превышает максимальное значение.</p>
      </div>
    </main>`;
    searchInp.value = "";
    return;
  } else if (value == "") {
    main.innerHTML = `
    <main>
      <div class="error-message">
        <p class="error">ERROR: Вы ввели пустой никнейм. Пожалуйста, повторите попытку.</p>
      </div>
    </main>`;
    searchInp.value = "";
    return;
  }

  fetch(`https://lichess.org/api/user/${value}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      main.innerHTML = "";
      if (data.error === "Not found") {
        main.innerHTML = `
    <main>
        <div class="error-message">
            <p class="error">ERROR: User с никнеймом ${value} не найден.</p>
        </div>
    </main>`;
        searchInp.value = "";
        return;
      } else if (data.disabled == true) {
        main.innerHTML = `<p class="infoTitle" style="padding-top: 30px;">Информация о профиле ${data.username}</p><p class="string" style="text-align: center; padding-top: 10px;">Данный аккаунт закрыт</p><div class="lichessLogotype"><img src="img/images.jpeg"></div>`;
        searchInp.value = "";
        return;
      }

      let timestamp = data.createdAt;
      let date = new Date(timestamp);
      let year = date.getUTCFullYear();
      let month = date.getUTCMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let day = date.getUTCDate() < 10 ? "0" + date.getUTCDate() : date.getUTCDate();
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
        data.perfs.classical.rating,
        data.count.loss,
        data.perfs.correspondence.rating
      );
    });
});
