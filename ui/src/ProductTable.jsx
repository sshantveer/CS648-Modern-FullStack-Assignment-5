import React from 'react';
import {Link, NavLink, withRouter} from 'react-router-dom';

const ProductRow = withRouter(({
                                   product, deleteProduct, index,
                               }) => {

        return (
            <tr>
                {/*<td>{product._id}</td>*/}
                <td>{product.id}</td>
                <td>{product.productName}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>
                    <a href={`/view/${product.id}`}>View</a>
                    {' | '}
                    <a href={`/edit/${product.id}`}>Edit</a>
                    {' | '}
                    <a href="javascript:void(0);" onClick={() => {
                        deleteProduct(index);
                    }}>
                    Delete
                    </a>
                </td>
            </tr>
        );
    }
);

export default function ProductTable({ products, deleteProduct }) {
    const productRows = products.map((product, index) => (
        <ProductRow
            key={product.id}
            product={product}
            deleteProduct={deleteProduct}
            index={index}
        />
    ));

    return (
        <div>
            <h4>Showing all available products</h4>
            <hr/>
            <table className="table">
                <thead>
                <tr>
                    {/*<th>Mongo Id</th>*/}
                    <th>Id</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {productRows}
                </tbody>
            </table>
        </div>
    );
}