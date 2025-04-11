import axios from "axios";
import "./featured.css";
import { useQuery } from "@tanstack/react-query";

const Featured = () => {
  const BASEURL = process.env.REACT_APP_BASEURL;
  const {
    data,

    isLoading: loading,
  } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await axios.get(`${BASEURL}holidays/all-packages`);
      return res?.data?.data;
    },
    keepPreviousData: true,
  });
  return (
    <div className="featured">
      {loading ? (
        "Loading please wait"
      ) : (
        <>
          <div className="featuredItem">
            <img
              src={data[Math.floor(Math.random() * 15) + 1].image}
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>{data[Math.floor(Math.random() * 15) + 1]?.city}</h1>
              <h2>{12} properties</h2>
            </div>
          </div>

          <div className="featuredItem">
            <img
              src={data[Math.floor(Math.random() * 15) + 1].image}
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>{data[Math.floor(Math.random() * 15) + 1]?.city}</h1>
              <h2>{38} properties</h2>
            </div>
          </div>
          <div className="featuredItem">
            <img
              src={data[Math.floor(Math.random() * 15) + 1].image}
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>{data[Math.floor(Math.random() * 15) + 1]?.city}</h1>
              <h2>{54} properties</h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Featured;
