import {faStar,faStarHalfAlt } from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props { value: any}

function Rating({value}: Props) {

    return (
        <section className='rating text-[#ffc107]'>
                    { value >= 1
                    ? <FontAwesomeIcon icon={faStar} />
                    : value >= 0.5
                        ? <FontAwesomeIcon icon={faStarHalfAlt} />
                        :  <FontAwesomeIcon icon={farStar} />
                    }

            { value >= 2
                    ? <FontAwesomeIcon icon={faStar} />
                    : value >= 1.5
                        ? <FontAwesomeIcon icon={faStarHalfAlt} />
                        :  <FontAwesomeIcon icon={farStar} />
                    }

            { value >= 3
                    ? <FontAwesomeIcon icon={faStar} />
                    : value >= 2.5
                        ? <FontAwesomeIcon icon={faStarHalfAlt} />
                        :  <FontAwesomeIcon icon={farStar} />
                    }

            { value >= 4
                    ? <FontAwesomeIcon icon={faStar} />
                    : value >= 3.5
                        ? <FontAwesomeIcon icon={faStarHalfAlt} />
                        : <FontAwesomeIcon icon={farStar} />
                    }

            { value >= 5
                    ? <FontAwesomeIcon icon={faStar} />
                    : value >= 4.5
                        ? <FontAwesomeIcon icon={faStarHalfAlt} />
                            :  <FontAwesomeIcon icon={farStar} />
                    }
        </section>
        
    )
}

export default Rating