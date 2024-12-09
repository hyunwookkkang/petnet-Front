import { useEffect, useState } from "react";
import { ListGroup} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const FavoriteInfo =() =>{
    const {favoriteId} = useParams(); //url에서 pram값 favoriteID 호출하기
    const navigate = useNavigate();
    const [favorite, setFavorite] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavoriteInfo = async () => {
            try {
                const response = await fetch(`/api/map/favorites/info?favoriteId=${favoriteId}`);
                const data = await response.json();
                setFavorite(data);
            } catch (error) {
                console.error("Error fetching favorite info:", error);
            } finally {
                setLoading(false);
            }  
        };
        fetchFavoriteInfo();
    },[favoriteId]);


    if (loading) {
    return <Spinner animation="border" />;
    }

    if (!favorite) {
        return <div>즐겨찾기 정보를 불러올 수 없습니다.</div>;
    }

    return(
        <div>
            <h3>{favorite.favoriteName}즐겨찾기</h3>
            <ListGroup>
                {favorite.items.map((item)=>(
                    <ListGroup.Item key={item.itemId} onClick={()=> navigate(`/place/${item.placeId}`)}>
                        {item.placeName}
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <button onClick={() => navigate("/placeMap")}>
                항목추가하기
            </button>
        </div>
    )
}

export default FavoriteInfo;