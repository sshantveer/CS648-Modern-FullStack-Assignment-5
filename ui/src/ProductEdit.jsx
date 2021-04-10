import React from "react";
import Link from "react-router-dom/Link";

import { graphQLFetch } from "./graphQLFetch.js";

import NumInput from "./NumInput.jsx";
import TextInput from "./TextInput.jsx";

export default class ProductEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      product: {},
      invalidFields: {},
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: { id: prevId },
      },
    } = prevProps;
    const {
      match: {
        params: { id },
      },
    } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState((prevState) => ({
      product: { ...prevState.product, [name]: value },
    }));
  }

  onValidityChange(event, valid) {
    const { name } = event.target;
    this.setState((prevState) => {
      const invalidFields = { ...prevState.invalidFields, [name]: !valid };
      if (valid) delete invalidFields[name];
      return { invalidFields };
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { product, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;

    const query = `mutation productUpdate(
              $id: Int!
              $changes: ProductUpdateInputs!
            ) {
              productUpdate(
                id: $id
                changes: $changes
              ) {
                id
                productName
                price
                category
                imageUrl
              }
            }`;

    const { id, created, ...changes } = product;
    const data = await graphQLFetch(query, { changes, id });
    if (data) {
      this.setState({ product: data.productUpdate });
      alert("Updated product successfully"); // eslint-disable-line no-alert
    }

    console.log(product); // eslint-disable-line no-console
  }

  async loadData() {
    const query = `query product($id: Int!) {
          product(id: $id) {
            id
            productName
            price
            category
            imageUrl
          }
        }`;

    const {
      match: {
        params: { id },
      },
    } = this.props;
    const data = await graphQLFetch(query, { id });
    this.setState({ product: data ? data.product : {}, invalidFields: {} });
  }

  render() {
    const {
      product: { id },
    } = this.state;
    const {
      match: {
        params: { id: propsId },
      },
    } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Product with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }

    const { invalidFields } = this.state;
    let validationMessage;
    if (Object.keys(invalidFields).length !== 0) {
      validationMessage = (
        <div className="error">
          Please correct invalid fields before submitting.
        </div>
      );
    }

    const {
      product: { productName, price },
    } = this.state;
    const {
      product: { category, imageUrl },
    } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <h3>{`Editing product: ${id}`}</h3>
        <table className="table">
          <tbody>
            <tr>
              <td>Product Name:</td>
              <td>
                <TextInput
                  name="productName"
                  value={productName}
                  onChange={this.onChange}
                  key={id}
                />
              </td>
            </tr>

            <tr>
              <td>Category:</td>
              <td>
                <select
                  name="category"
                  value={category}
                  onChange={this.onChange}
                >
                  <option value="Shirts">Shirts</option>
                  <option value="Jeans">Jeans</option>
                  <option value="Jackets">Jackets</option>
                  <option value="Sweaters">Sweaters</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </td>
            </tr>

            <tr>
              <td>Price ($):</td>
              <td>
                <NumInput
                  name="price"
                  value={price}
                  onChange={this.onChange}
                  key={id}
                />
              </td>
            </tr>
            <tr>
              <td>Image URL:</td>
              <td>
                <TextInput
                  size={50}
                  name="imageUrl"
                  value={imageUrl}
                  onChange={this.onChange}
                  key={id}
                />
              </td>
            </tr>

            <tr>
              <td />
              <td>
                <button type="submit">Submit</button>
              </td>
            </tr>
          </tbody>
        </table>
        {validationMessage}
        <Link to={`/products`}>Go Back</Link>
      </form>
    );
  }
}
