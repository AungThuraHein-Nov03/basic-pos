import React, { useState, useMemo } from 'react';
import { TransactionService } from '../services/storage.js';
import '../index.css';

const SalesJournal = () => {
    const [products] = useState(() => TransactionService.getProducts());
    const [transactions, setTransactions] = useState(() => TransactionService.getTransactions());
    const [formData, setFormData] = useState({
        productId: '',
        customName: '',
        quantity: 1,
        date: new Date().toISOString().split('T')[0],
        isCustom: false,
        customPrice: 0,
        customCategory: 'other'
    });

    const selectedProduct = useMemo(() => {
        return products.find(p => p.itemName === formData.productId);
    }, [products, formData.productId]);

    const unitPrice = formData.isCustom ? formData.customPrice : (selectedProduct?.unitPrice || 0);
    const totalPrice = unitPrice * formData.quantity;

    
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'descending' });

    
    const sortedTransactions = useMemo(() => {
        let sortableItems = [...transactions];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                let valueA = a[sortConfig.key];
                let valueB = b[sortConfig.key];
                if (typeof valueA === 'string') valueA = valueA.toLowerCase();
                if (typeof valueB === 'string') valueB = valueB.toLowerCase();
                if (valueA < valueB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valueA > valueB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [transactions, sortConfig]);

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
        }
        return '';
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.date || formData.quantity <= 0) return;

        if (!formData.isCustom && !selectedProduct) return;
        if (formData.isCustom && (!formData.customName || formData.customPrice < 0)) return;

        const transaction = {
            itemName: formData.isCustom ? formData.customName : selectedProduct.itemName,
            category: formData.isCustom ? formData.customCategory : selectedProduct.category,
            quantity: Number(formData.quantity),
            unitPrice: Number(unitPrice),
            totalPrice: Number(totalPrice),
            date: formData.date,
            isCustom: formData.isCustom
        };

        const saved = TransactionService.addTransaction(transaction);
        if (saved) {
            setTransactions(prev => [saved, ...prev]);
            // Reset form (keep date)
            setFormData(prev => ({
                ...prev,
                productId: '',
                customName: '',
                quantity: 1,
                isCustom: false,
                customPrice: 0
            }));
        }
    };

    return (
        <div>
            <h2>Sales Journal</h2>

            <div className="journal-container">

                {/* Entry Form */}
                <div className="card journal-form">
                    <h3>New Entry</h3>

                    <form onSubmit={handleSubmit} className="journal-form-container">

                        <div className="journal-custom-checkbox-container">
                            <label className="journal-custom-checkbox-label">
                                <input
                                    type="checkbox"
                                    name="isCustom"
                                    checked={formData.isCustom}
                                    onChange={handleInputChange}
                                />
                                <span className="journal-custom-checkbox-text">Custom Item / Expense</span>
                            </label>
                        </div>

                        <div>
                            <label>Date:</label>
                            <input
                                type="date"
                                name="date"
                                className="input"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {!formData.isCustom ? (
                            <div>
                                <label>Product:</label>
                                <select
                                    name="productId"
                                    className="input"
                                    value={formData.productId}
                                    onChange={handleInputChange}
                                    required={!formData.isCustom}
                                >
                                    <option value="">Select Product</option>
                                    {products.map((p, idx) => (
                                        <option key={idx} value={p.itemName}>
                                            {p.itemName} ({p.unitPrice})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label>Description:</label>
                                    <input
                                        type="text"
                                        name="customName"
                                        className="input"
                                        value={formData.customName}
                                        onChange={handleInputChange}
                                        required={formData.isCustom}
                                    />
                                </div>
                                <div className="journal-form-grid">
                                    <div>
                                        <label>Category:</label>
                                        <input
                                            type="text"
                                            name="customCategory"
                                            className="input"
                                            value={formData.customCategory}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Unit Price:</label>
                                        <input
                                            type="number"
                                            name="customPrice"
                                            className="input"
                                            min="0"
                                            step="0.01"
                                            value={formData.customPrice}
                                            onChange={handleInputChange}
                                            required={formData.isCustom}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label>Quantity:</label>
                            <input
                                type="number"
                                name="quantity"
                                className="input"
                                min="1"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="journal-total-display">
                            <strong>Total: {totalPrice.toLocaleString()}</strong>
                        </div>

                        <button type="submit" className="btn btn-primary journal-submit-button">Save</button>
                    </form>
                </div>

                {/* Transaction History */}
                <div className="journal-list">
                    <div className="card">
                        <h3>Transactions List</h3>

                        <div style={{ marginBottom: '1rem', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <strong>Sort by:</strong>
                            <button
                                type="button"
                                onClick={() => handleSort('totalPrice')}
                                style={{ padding: '4px 8px', cursor: 'pointer' }}
                            >
                                Total Price{getSortIndicator('totalPrice')}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSort('category')}
                                style={{ padding: '4px 8px', cursor: 'pointer' }}
                            >
                                Category{getSortIndicator('category')}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSort('quantity')}
                                style={{ padding: '4px 8px', cursor: 'pointer' }}
                            >
                                Quantity Sold{getSortIndicator('quantity')}
                            </button>
                        </div>

                        <div className="journal-table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Item</th>
                                        <th>Category</th>
                                        <th>Qantity</th>
                                        <th>Unit Price</th>
                                        <th>Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedTransactions.length === 0 ? (
                                        <tr><td colSpan="6">No records.</td></tr>
                                    ) : (
                                        sortedTransactions.map((t) => (
                                            <tr key={t.id}>
                                                <td>{t.date}</td>
                                                <td>
                                                    {t.itemName}
                                                    {t.isCustom && ' (Custom)'}
                                                </td>
                                                <td>{t.category}</td>
                                                <td>{t.quantity}</td>
                                                <td>{t.unitPrice}</td>
                                                <td>{t.totalPrice}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SalesJournal;
