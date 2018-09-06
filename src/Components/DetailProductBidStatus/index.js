import React, {Component} from 'react'
import axios from 'axios'
import Countdown from 'react-countdown-now'
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux'
import {Container, Row, Col, Form, 
    Input, Button,
    UncontrolledTooltip} from 'reactstrap'

const styles = {
    text : {
        textAlign :'center'
    },
    title : {
        fontSize : '18px',
        fontWeight : 'bold'
    },
    button : {
        width : '200px'
    },
    contains : {
        marginBottom : '10px'
    }
    
}

const request = axios.create({
    baseURL: 'https://lelangbuana.herokuapp.com' || 'http://localhost:3000',
    timeout: 10000,
    headers: { Authorization: '' }
})

const mapStateToProps = (state,props) => {
    return {
        bid_id: state.bidData.bid_id,
        title: state.auction.title,
        item_condition: state.auction.item_condition,
        item_description: state.auction.item_description,
        quantity: state.auction.quantity,
        bids_nominal: state.bidData.bids_nominal,
        auction_id: state.auction.auction_id,
        user_id: state.user.user_id,
        max_bid: state.auction.max_bid,
        min_bid: state.auction.min_bid,
        item_photo: state.auction.item_photo,
        status: state.auction.status,
        start_bid: state.auction.start_bid,
        highest_bid: state.auction.highest_bid,
        login: state.user.login,
        username: state.user.login.username,
        start_date: state.auction.start_date,
        end_date: state.auction.end_date,
        bids_multiply: state.auction.bids_multiply,
        winner: state.auction.winner
    }
}

class DetailProductBidStatus extends Component{
    constructor(props){
        super(props)
        this.state={
            bids_nominal: 0
        }
    }

    componentDidMount(){
        
    }

    getInitialState(){
        return ({amount: "0.00"});
    }

    handleChange = (event,props) => {
        this.setState({ 
            [event.target.name]: event.target.value,
            auction_id: this.props.auction_id,
            user_id: this.props.user_id,
            max_bid: this.props.max_bid
        })
    }

    handleSubmit = event => {
        event.preventDefault()
        
        const payload = {
            bids_nominal: this.state.bid_nominal,
            auction_id: this.props.auction_id,
            user_id: localStorage.getItem('user_id'),
            status: ""
        }
        console.log("PAYLOAD",payload);
        
        request
        .post('/bids',payload)
        .then((response) => {
          this.props.dispatch({
              type: 'BID',
              payload: {
                bids_nominal: this.state.bid_nominal,
                auction_id: this.state.auction_id,
                user_id: localStorage.getItem('user_id'),
                max_bid: this.props.max_bid
              }
            })
            console.log("BID STATE", response)
      })
      .catch(error=>{console.log(error)})
    }

    buyOut = event => {
        event.preventDefault()
        const payload = {
            bids_nominal: this.props.max_bid,
            auction_id: this.props.auction_id,
            user_id: localStorage.getItem('user_id'),
            status: "win"
        }
        const update = {
            user_id: localStorage.getItem('user_id'),
            title: this.props.title,
            item_condition: this.props.item_condition,
            item_description: this.props.item_description,
            quantity: this.props.quantity,
            start_bid: this.props.start_bid,
            max_bid: this.props.max_bid,
            min_bid: this.props.min_bid,
            bids_multiply: this.props.bids_multiply,
            start_date: this.props.start_date,
            end_date: this.props.end_date,
            item_photo: this.props.item_photo,
            status: "success"
        }
        
        console.log("AUCTION PAYLOAD DATA : ", update);

        request
        .post('/bids',payload)
        .then((response) => {
            console.log("BUY OUT : ", response)
            request
            .put(`/auctions/${this.props.auction_id}`,update)
            .then(response => {
                console.log("AUCTION RESPONSE UPDATE WIN : ", response)
                
            })
            .catch(error=>{console.log(error)})
      })
      .catch(error=>{console.log(error)})
        
    }

    render(){

        let startBid
        let enableCountDown
        this.props.highest_bid>=this.props.start_bid
        ? startBid = this.props.highest_bid + this.props.bids_multiply
        : startBid = this.props.start_bid + this.props.bids_multiply

        let now = Date.now()
        let end = Date.parse(this.props.end_date)
        let start = Date.parse(this.props.start_date)

        now<=end && this.props.status === "ongoing"
        ? enableCountDown = <Countdown  date={ start + (end-start)}><h3>CLOSED</h3></Countdown>
        : enableCountDown = <h3>CLOSED</h3>
        
        
        let enableBid
        console.log("STATUS: ", this.props.status)
        
        this.props.status === "ongoing"
        ? enableBid = 
            <div>
            <Row style={styles.contains}>
                    <Col><span>Bid Increment : <NumberFormat value={this.props.bids_multiply} displayType={'text'} thousandSeparator={true} prefix={'IDR. '} /> </span></Col>
                </Row>
            <Row style={styles.contains}>
                <Col >
                    <Form lg="6">
                        <Input
                            onChange={this.handleChange}
                            type="number"
                            name="bid_nominal"
                            id="bid_nominal"
                            placeholder="IDR."
                            step={this.props.bids_multiply}
                            min={startBid}
                        />
                    </Form>
                </Col>
            </Row>
            <Row style={styles.contains}> 
                <Col>
                    <Button style={styles.button} onClick={this.handleSubmit}> Bid Now</Button>
                </Col>
            </Row>
            <Row>
                <Col><Button color="warning" style={styles.button} onClick={this.buyOut}> <span id="UncontrolledTooltipExample"> Win for Buyout Price </span></Button>
                <UncontrolledTooltip placement="bottom" target="UncontrolledTooltipExample">
                    Buy This Product Instantly
                </UncontrolledTooltip>
                </Col>
            </Row>
            </div>
        : enableBid = 
            <div>
                <Row><Col style={styles.title}><span>Winner</span></Col></Row>
                <Row style={styles.contains}><Col><span>{this.props.winner}</span></Col></Row>

            </div>
        
        return(
            <div style={styles.text}>
                <Container >  
                    <Row><Col style={styles.title}><span>Current Price</span></Col></Row>
                    <Row style={styles.contains}><Col ><span> <NumberFormat value={this.props.highest_bid} displayType={'text'} thousandSeparator={true} prefix={'IDR. '}/> </span></Col></Row>
                    <hr/>
                    <Row><Col style={styles.title}><span>Maximum Price</span></Col></Row>
                    <Row style={styles.contains}><Col><span> <NumberFormat value={this.props.buyOutPrice} displayType={'text'} thousandSeparator={true} prefix={'IDR. '} /> </span></Col></Row> 
                    <hr/>
                    <Row><Col style={styles.title}>
                    <span>Time Remaining 
                    </span>
                    </Col></Row>
                    <Row style={styles.contains}><Col><span>
                    {enableCountDown}
                        </span></Col></Row>
                    <hr/>
                    <Row><Col style={styles.title}><span>Seller</span></Col></Row>
                    <Row style={styles.contains}><Col><span>{this.props.seller}</span></Col></Row>
                    <hr/>
                    {enableBid}
                </Container>
            </div>
        )
    }
}

export default connect (mapStateToProps)(DetailProductBidStatus)