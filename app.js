const API_KEY = "9fab3ef1d371e73ccc5e7b77cf1f54701ca89336";
const CORP_CODE = "00126380"; // 삼성전자 코드
const YEAR = "2022";
const REPORT_CODE = "11011"; // 11011: 사업보고서 (나머지는 반기 / 분기 보고서)
// let url = new URL(
//   `https://cors-anywhere.herokuapp.com/https://opendart.fss.or.kr/api/fnlttSinglAcnt.json?corp_code=${COMPANY_CODE}&bsns_year=${YEAR}&reprt_code=${REPORT_CODE}&crtfc_key=${API_KEY}`
// );
const CORS_LINK = "https://cors-anywhere.herokuapp.com/";
const API_LINK = "https://opendart.fss.or.kr/api/fnlttSinglAcnt.json"
const CORP_API_LINK = "https://opendart.fss.or.kr/api/company.json"

let url = new URL(
  `${CORS_LINK}${API_LINK}?crtfc_key=${API_KEY}&corp_code=${CORP_CODE}&bsns_year=${YEAR}&reprt_code=${REPORT_CODE}`
);
let url2 = new URL(
  `${CORS_LINK}${CORP_API_LINK}?crtfc_key=${API_KEY}&corp_code=${CORP_CODE}`
);

const corpList = document.querySelector(".corp");

const getCompanyInfo = async () => {
  const response = await fetch(url2);
  const data = await response.json();
  console.log(data);
  render(data);
};

getCompanyInfo();

const render = (data) => {
  corpList.textContent = data.corp_name;
};
