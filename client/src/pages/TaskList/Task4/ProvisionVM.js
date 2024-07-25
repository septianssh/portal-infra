import React, { useState } from 'react';

const Tab = ({ tab, isActive, onClick }) => {
    return (
        <li className="me-2">
            <a
                href="#"
                onClick={onClick}
                className={`inline-block px-4 py-3 rounded-lg ${isActive ? 'text-white bg-blue-600' : 'hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'}`}
            >
                Tab {tab.id + 1}
            </a>
        </li>
    );
};

const FormSelector = ({ onAddTab }) => {
    const [formType, setFormType] = useState('');

    const handleAdd = () => {
        if (formType) {
            onAddTab(formType);
            setFormType('');
        }
    };

    return (
        <div className="mb-4 flex items-center">
            <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="p-2 border rounded mr-2"
            >
                <option value="">Select Form Type</option>
                <option value="type1">Form Type 1</option>
                <option value="type2">Form Type 2</option>
            </select>
            <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Add Tab
            </button>
        </div>
    );
};

const Modal = ({ data, onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-4 w-1/2">
                <h2 className="text-xl mb-4">Form Data Overview</h2>
                {data.map((tab, index) => (
                    <div key={tab.id} className="mb-2">
                        <h3 className="text-lg">Tab {tab.id + 1} ({tab.type}):</h3>
                        <pre>{JSON.stringify(tab.data, null, 2)}</pre>
                    </div>
                ))}
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
};



const TabManager = () => {
    const [tabs, setTabs] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleAddTab = (formType) => {
        const newTab = {
            id: tabs.length,
            type: formType,
            data: {}
        };
        setTabs([...tabs, newTab]);
        setActiveTab(newTab.id);
    };

    const handleFormChange = (e, tabId) => {
        const { name, value } = e.target;
        setTabs(tabs.map(tab => tab.id === tabId ? { ...tab, data: { ...tab.data, [name]: value } } : tab));
    };

    const handleSubmit = () => {
        setShowModal(true);
    };

    return (
        <div className="p-4">
            <FormSelector onAddTab={handleAddTab} />
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400 my-4">
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        tab={tab}
                        isActive={activeTab === index}
                        onClick={() => setActiveTab(index)}
                    />
                ))}
            </ul>
            {tabs.map((tab, index) => (
                <div key={index} className={activeTab === index ? '' : 'hidden'}>
                    <form className="space-y-4">
                        {tab.type === 'type1' && (
                            <>
                                <input type="text" name="field1" placeholder="Field 1" onChange={(e) => handleFormChange(e, tab.id)} className="w-full p-2 border rounded" />
                                <input type="text" name="field2" placeholder="Field 2" onChange={(e) => handleFormChange(e, tab.id)} className="w-full p-2 border rounded" />
                            </>
                        )}
                        {tab.type === 'type2' && (
                            <>
                                <input type="text" name="fieldA" placeholder="Field A" onChange={(e) => handleFormChange(e, tab.id)} className="w-full p-2 border rounded" />
                                <input type="text" name="fieldB" placeholder="Field B" onChange={(e) => handleFormChange(e, tab.id)} className="w-full p-2 border rounded" />
                            </>
                        )}
                    </form>
                </div>
            ))}
            {tabs.length > 0 && (
                <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Submit</button>
            )}
            {showModal && (
                <Modal data={tabs} onClose={() => setShowModal(false)} />
            )}
        </div>
    );
};

export default TabManager;
