import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";

interface Props {
    rating: number;
    setRating: (rating: number) => void;
}
const StarRating = ({ rating, setRating }: Props) => {
    const [hover, setHover] = useState(0);

    return (
        <section className="star-rating text-3xl text-center mt-8 text-[#ffc107]">
            {[...Array(5)].map((_, index) => {
                index += 1;
                return (
                    <button
                        type="button"
                        key={index}
                        className="star-button"
                        onClick={() => setRating(index)}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating)}
                    >
                        <FontAwesomeIcon 
                            icon={
                                index <= (hover || rating)
                                ? faStar
                                : farStar
                            }
                        />
                    </button>
                );
            })}
        </section>
    );
};

export default StarRating;