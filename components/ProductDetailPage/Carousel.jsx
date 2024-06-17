import { useEffect } from "react";

function CarouselFade(props) {
    return (
        <div id="carouselExampleIndicators" data-bs-interval="false" className="carousel slide" style={{ width: '100%', height: '100%' }}>
            <div className="carousel-indicators">
                {
                    props.product_image && (
                        <button
                            type="button"
                            data-bs-target="#carouselExampleIndicators"
                            className="active"
                            aria-current="true"
                            aria-label="Slide 1">
                            <img src={props.product_image} alt="" />
                        </button>
                    )
                }
            </div>
            <div className="carousel-inner">
                {
                    props.product_image && (
                        <div className="carousel-item active">
                            <img src={props.product_image} className="d-block w-100" alt="..." style={{ height: '100%' }} />
                        </div>
                        // <div className="carousel-item">
                        //     <img src={props.product_image} className="d-block w-100" alt="..." />
                        // </div>
                    )
                }
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div >
    );
}

export default CarouselFade;