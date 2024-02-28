// require('dotenv').config();
// const API_KEY = process.env.API_KEY;
const API_KEY = "9fab3ef1d371e73ccc5e7b77cf1f54701ca89336";
const CORP_CODE = ["00126380", "00126380", "00126380", "00126380", "00126380"]; // 삼성전자 코드
const YEAR = "2020";
const REPORT_CODE = "11013"; // 11011: 사업보고서 (나머지는 반기 / 분기 보고서)

const CORS_LINK = "https://cors-anywhere.herokuapp.com/";
const CORP_NAME_API_LINK = "https://opendart.fss.or.kr/api/company.json";
const CORP_INFO_API_LINK = "https://opendart.fss.or.kr/api/fnlttSinglAcnt.json";

let corpInfos = [];

const favoritClickBtn = document.querySelector(".p-favorite-button");
let isLiked = false;

favoritClickBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (!isLiked) {
    favoritClickBtn.src = "asset/like.png";
    isLiked = true;
  } else {
    favoritClickBtn.src = "asset/no-like.png";
    isLiked = false;
  }
});

const popularGetCorpInfo = async () => {
  for (let corp of CORP_CODE) {
    let corpName_url = new URL(
      `${CORS_LINK}${CORP_NAME_API_LINK}?crtfc_key=${API_KEY}&corp_code=${corp}`
    );
    let corpInfo_url = new URL(
      `${CORS_LINK}${CORP_INFO_API_LINK}?crtfc_key=${API_KEY}&corp_code=${corp}&bsns_year=${YEAR}&reprt_code=${REPORT_CODE}`
    );
    const responseCorpName = await fetch(corpName_url);
    const responseCorpInfo = await fetch(corpInfo_url);
    const dataCorpName = await responseCorpName.json();
    const dataCorpInfo = await responseCorpInfo.json();

    console.log(dataCorpName);
    console.log(dataCorpInfo);

    let corpInfo = {
      corpName: dataCorpName.corp_name,
      sales: parseFloat(dataCorpInfo.list[23].thstrm_amount.replace(/,/g, "")),
      assetThisYear: parseFloat(
        dataCorpInfo.list[23].thstrm_amount.replaceAll(",", "")
      ),
      assetLastYear: parseFloat(
        dataCorpInfo.list[23].frmtrm_amount.replace(/,/g, "")
      ),
      //매출액 증가율 = (당기 매출액 - 전기 매출액) / 전기 매출액 × 100
      asset: parseFloat(dataCorpInfo.list[16].thstrm_amount.replace(/,/g, "")),
      netIncome: parseFloat(
        dataCorpInfo.list[26].thstrm_amount.replace(/,/g, "")
      ),
    };

    corpInfos.push(corpInfo);
    render();
  }
};

popularGetCorpInfo();

const render = () => {
  let result = "";
  for (let info of corpInfos) {
    result += `<a class="p-corp" href="https://m.stock.naver.com/domestic/stock/005930/total">
                <div class="p-corpName">
                    <span>
                        <img class="p-favorite-button" src="asset/no-like.png">
                    </span>
                    ${info.corpName}
                </div>
                <div class="p-sales">
                    ${Math.ceil(info.sales / 1000000000000)}조원
                </div>
                <div class="p-salesIncrease">
                    <div class="redbox">${Math.ceil(
                      ((info.assetThisYear - info.assetLastYear) /
                        info.assetLastYear) *
                        100
                    )}%</div>
                </div>
                <div class="p-asset">
                    ${Math.ceil(info.asset / 1000000000000)}조원
                </div>
                <div class="p-netIncome">
                    ${Math.ceil(info.netIncome / 1000000000000)}조원
                </div>
            </a>`;
  }
  document.querySelectorAll(".p-listContent")[1].innerHTML = result;
};
