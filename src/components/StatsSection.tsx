import React from "react";
import CountUp from "react-countup";

const StatsSection = () => {
    const stats = [
        { end: "232+", label: "Users" },
        { end: "95+", label: "Efficient Service Delivery (%)" },
        { end: "1453+", label: "Hours Of Support" },
        { end: "32+", label: "Team" },
    ];

    return (
        <section className="stats section mt-5 pt-5 border-top" id="stats">
            <div className="container" data-aos="fade-up" data-aos-delay="100">
                <div className="row gy-4 text-center">
                    {stats.map((stat, i) => (
                        <div key={i} className="col-lg-3 col-md-6">
                            <div className="stats-item w-100 h-100 p-4 shadow-sm rounded bg-light">
                                <span className="display-4 fw-bold text-primary">
                                    <CountUp start={0} end={parseInt(stat.end)} duration={1} /> {/* Just animate the number */}
                                    <span className="text-primary">{stat.end.slice(-1)}</span> {/* Append the "+" sign after the number */}
                                </span>
                                <p className="mt-2 mb-0 fw-medium text-secondary">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
