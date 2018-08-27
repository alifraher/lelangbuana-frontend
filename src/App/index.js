import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

// import { createStore } from 'redux'
// import { Provider } from 'react-redux'

import ButtonModern from './../ButtonModern'
import NavBar from './../NavBar'
import CardAuction from './../CardAuction'
import Categories from './../Categories'
import Footer from './../Footer'
import ListAuctionCard from '../ListAuctionCard'

// const initialState ={
//     user: {
//         name: 'newUser',
//         token: ''
//     }
// }


class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <NavBar/>
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-sm-2">
                                <Categories name="Computers"/>
                                <Categories name="Electronic, AV & Camera"/>
                                <Categories name="Music"/>
                                <Categories name="Book & Magazine"/>
                                <Categories name="Movies"/>

                            </div>
                            <div class="col-sm">
                                <div class="row">
                                    <CardAuction title="Macbook"/>
                                    <CardAuction title="iPhone"/>
                                    <CardAuction title="PC"/>
                                    <CardAuction title="Car"/>
                                    <CardAuction title="Motorcycle"/>
                                    <CardAuction title="House"/>
                                    <CardAuction title="Clothes"/>
                                    <CardAuction title="Sneaker"/>
                                    <CardAuction title="Jewelry"/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <Link to="/listing"><ButtonModern/></Link>
                        </div>
                        <div class="row">
                            <Footer/>
                        </div>
                    </div>

                    <Route exact path="/" component={App} />
                    <Route path="/listing" component={ListAuctionCard} />

                </div>
            </Router>
        )
    }
}

export default App
