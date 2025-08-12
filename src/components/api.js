const API_URL = "https://trip-wiki-api.vercel.app";
//start / sort /search

export const request = async (startIdx, region, sortBy, searchWord) => {
  try {
    let url = `${API_URL}`;
    if (region && region !== "All") {
      url += `${region}?start=${startIdx}`;
    } else {
      url += `?start=${startIdx}`;
    }

    if (sortBy) {
      url += `&sort=${sortBy}`;
    }

    if (searchWord) {
      url += `&search=${searchWord}`;
    }

    const response = await fetch(url);
    if (response) {
      let data = await response.json();
      /**
       * response :
       * @ cities (40건씩..Array)
       * @ isEnd  (false / true)
       */
      return data;
    }
  } catch (err) {
    console.log(err);
  }
};
