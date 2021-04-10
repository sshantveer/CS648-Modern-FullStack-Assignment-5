import React from 'react';
import Link from "react-router-dom/Link";

import {graphQLFetch} from './graphQLFetch.js';

export default class ProductView extends React.Component {
    constructor() {
        super();
        this.state = {
            product: {},
            invalidFields: {},
        };
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        const query = `query product($id: Int!) {
          product(id: $id) {
            id
            productName
            imageUrl
          }
        }`;

        const { match: { params: { id } } } = this.props;
        const data = await graphQLFetch(query, { id });
        this.setState({ product: data ? data.product : {}, invalidFields: {} });
    }

    render() {
        const { product: { id } } = this.state;
        const { match: { params: { id: propsId } } } = this.props;
        if (id == null) {
            if (propsId != null) {
                return <h3>{`Product with ID ${propsId} not found.`}</h3>;
            }
            return null;
        }

        const { product: { productName, imageUrl } } = this.state;
        var finalImageUrl;
        if(!imageUrl.includes("http")) {
            const protocol = window.location.protocol;
            const hostname = window.location.host;
            finalImageUrl = protocol + "//" + hostname + "/" + imageUrl;
        } else {
            finalImageUrl = imageUrl;
        }
        return (
            <form>

                <table className="table">
                    <tbody>
                    <tr>
                        <td>
                            <h3>{`Product : ${productName}`}</h3>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img src={finalImageUrl}
                                key={id}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <Link to={`/products`}>Go Back</Link>
            </form>
        );
    }
}