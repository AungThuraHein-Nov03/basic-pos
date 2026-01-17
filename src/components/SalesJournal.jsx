import React, { useState } from 'react';

const SalesJournalTest = ({ products, addTransaction }) => {

    const [sPro, setPro] = useState('');
    const [qty, setQty] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();

        const product = products.find(p => p.itemName === sPro);
        if (!product) {
            alert("Please select a valid product :(");
            return;
        }

        addTransaction({
            itemName: product.itemName,
            category: product.category,
            quantity: Number(qty),
            unitPrice: product.unitPrice,
            totalPrice: product.unitPrice * qty,
            date: new Date().toISOString().split('T')[0],
            isCustom: false
        });
        //Sorry, too much D&D and my brain is addicted!
        alert("It is done, my liege.");
        setQty(1);
    };

    return (
        <div style={{ padding: '20px', border: '5px solid blue', margin: '20px' }}>
            <h2 style={{ color: 'white' }}>Sales Inpt Test</h2>

            <form onSubmit={handleSubmit}>
                <p>
                    <label>Select Product: </label><br />
                    <select value={sPro} onChange={(e) => setPro(e.target.value)}>
                        <option value="">-- Choose Item --</option>
                        {products.map(p => (
                            <option key={p.itemName} value={p.itemName}>
                                {p.itemName} | {p.category} | {p.unitPrice}
                            </option>
                        ))}
                    </select>
                </p>

                <p>
                    <label>Quantity:</label><br />
                    <input
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        min="1"
                    />
                </p>

                <button type="submit">Submit Sale</button>
            </form>
        </div>
    );
};

export default SalesJournalTest;
