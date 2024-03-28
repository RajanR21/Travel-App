import { useQuery } from "@tanstack/react-query";
import "./featuredProperties.css";
import axios from "axios";

const FeaturedProperties = () => {
  // const { data, loading, error } = useFetch("/hotels?featured=true&limit=4");
  const BASEURL = process.env.REACT_APP_BASEURL;
  const { data, isLoading: loading } = useQuery({
    queryKey: ["hotels"],
    queryFn: async () => {
      const res = await axios.get(`${BASEURL}hotels/all-hotels?page=2`);
      return res?.data?.data;
    },
    keepPreviousData: true,
  });
  return (
    <div className="fp">
      {loading ? (
        "Loading"
      ) : (
        <>
          {data?.map((item) => (
            <div className="fpItem" key={item._id}>
              <img src={item.image} alt="" className="fpImg" />
              <span className="fpName">{item.name}</span>
              <span className="fpCity">{item.city}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FeaturedProperties;
