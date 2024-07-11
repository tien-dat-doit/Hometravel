// Filters.js
import React, { useState } from 'react';

const Filters = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState('');

    const handleSearchChange = (e : any) => {
        setSearchTerm(e.target.value);
    };

    const handleOptionChange = (e : any) => {
        setSelectedOption(e.target.value);
    };

    return (
        <div className="bg-gray-200 p-4">
            <div className="flex items-center space-x-4">
                <button
                    type="button"
                    className="btn btn-light shadow-sm"
                    data-toggle="collapse"
                    data-target="#filters"
                >
                    Filters <i className="fa fa-filter"></i>
                </button>
                <input
                    type="text"
                    className="flex-grow border-2 p-2"
                    placeholder="Search for Startups..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div id="filters" className="collapse mt-4">
                <div className="filter-group">
                    <h6 className="title">Domain</h6>
                    <select
                        className="form-select"
                        value={selectedOption}
                        onChange={handleOptionChange}
                    >
                        <option value="">Select Domain</option>
                        <option value="ecommerce">E-commerce</option>
                        {/* Add more options as needed */}
                    </select>
                </div>

                <div className="filter-group">
                    <h6 className="title">Team Size</h6>
                    {/* Add team size options */}
                </div>

                {/* Add more filter groups as needed */}
            </div>
        </div>
    );
};

export default Filters;
