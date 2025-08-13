import Header from "./components/Header.js";
import RegionList from "./components/RegionList.js";
import CityList from "./components/CityList.js";
import CityDetail from "./components/CityDetail.js";
import { request } from "./components/api.js";

export default function ($app) {
  const getSortBy = () => {
    if (window.location.search) {
      return window.location.search.split("sort=")[1].split("&")[0];
    } else {
      return "total";
    }
  };
  const getSearchWord = () => {
    if (window.location.search && window.location.search.includes("search")) {
      return window.location.search.split("search=")[1];
    } else {
      return "";
    }
  };
  this.state = {
    startIdx: 0,
    sortBy: getSortBy(),
    searchWord: getSearchWord(),
    region: "",
    cities: "",
  };
  //header components (검색, 정렬)
  const header = new Header({
    $app,
    initialState: {
      sortBy: this.state.sortBy,
      searchWord: this.state.searchWord,
    },
    handleSortChange: async (sortBy) => {
      const pageUrl = `/${this.state.region}?sort=${sortBy}`;
      history.pushState(null, null, this.state.searchWord ? pageUrl + `&search=${this.state.searchWord}` : pageUrl);

      const cities = await request(0, this.state.region, sortBy, this.state.searchWord);
      this.setState({
        ...this.state,
        startIdx: 0,
        sortBy: sortBy,
        cities: cities,
      });
    },
    handleSearch: async (searchWord) => {
      history.pushState(null, null, `/${this.state.region}?sort=${this.state.sortBy}&search=${searchWord}`);
      const cities = await request(0, this.state.region, this.state.sortBy, searchWord);
      this.setState({
        ...this.state,
        startIdx: 0,
        searchWord: searchWord,
        cities: cities,
      });
    },
  });

  //regionList components (도시 키워드 나열)
  const regionList = new RegionList({
    $app,
    initialState: this.state.region,
    handleRegion: async (region) => {
      history.pushState(null, null, `/${region}?sort=total`);
      const cities = await request(0, region, "total");
      this.setState({
        ...this.state,
        startIdx: 0,
        sortBy: "total",
        region: region,
        cities: cities,
        searchWord: "",
        currentPage: `/${region}`,
      });
    },
  });

  //cityList components (목록)
  const cityList = new CityList({
    $app,
    initialState: this.state.cities,
    handleLoadMore: async () => {
      const newStartIdx = this.state.startIdx + 40;
      const newCities = await request(newStartIdx, this.state.region, this.state.sortBy, this.state.searchWord);
      this.setState({
        ...this.state,
        startIdx: newStartIdx,
        cities: {
          cities: [...this.state.cities.cities, ...newCities.cities],
          isEnd: newCities.isEnd,
        },
      });
    },
  });

  //cityDetail components (상세페이지)
  const cityDetail = new CityDetail();

  //setState function
  this.setState = (newState) => {
    this.state = newState;
    cityList.setState(this.state.cities);
    header.setState({ sortBy: this.state.sortBy, searchWord: this.state.searchWord });
    regionList.setState(this.state.region);
  };

  //init function
  const init = async () => {
    const cities = await request(this.state.startIdx, this.state.region, this.state.sortBy, this.state.searchWord);
    this.setState({
      ...this.state,
      cities: cities,
    });
  };

  window.addEventListener("popstate", async () => {
    const urlPath = window.location.pathname;

    const prevRegion = urlPath.replace("/", "");
    const prevPage = urlPath;
    const prevSortBy = getSortBy();
    const prevSearchWord = getSearchWord();
    const prevStartIdx = 0;
    const prevCities = await request(prevStartIdx, prevRegion, prevSortBy, prevSearchWord);

    this.setState({
      ...this.state,
      startIdx: prevStartIdx,
      sortBy: prevSortBy,
      region: prevRegion,
      currentPage: prevPage,
      searchWord: prevSearchWord,
      cities: prevCities,
    });
  });

  init();
}
