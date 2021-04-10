import React from "react";
import PropTypes from "prop-types";

export default class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const product = {
      productName: form.productName.value,
      price: form.price.value,
      category: form.category.value,
      imageUrl: form.imageUrl.value,
    };
    this.props.createProduct(product);
    form.productName.value = "";
    form.price.value = "";
    form.category.value = "";
    form.imageUrl.value = "";
  }

  render() {
    return (
      <div>
        <h4>Add a new product to inventory</h4>
        <hr />
        <form name="productAdd" onSubmit={this.handleSubmit}>
          <table className="table">
            <tbody>
              <tr>
                <td>
                  <label>Category</label>
                  <br />
                  <select id="category" name="category">
                    <option value="Shirts">Shirts</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Jackets">Jackets</option>
                    <option value="Sweaters">Sweaters</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </td>
                <td>
                  <label>Price Per Unit</label>
                  <br />
                  <input type="text" name="price" placeholder="$" />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Product Name</label>
                  <br />
                  <input type="text" name="productName" />
                </td>
                <td>
                  <label>Image URL</label>
                  <br />
                  <input type="text" name="imageUrl" />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <button name="submit">Add Product</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }
}

ProductAdd.propTypes = {
  createProduct: PropTypes.func.isRequired,
};
