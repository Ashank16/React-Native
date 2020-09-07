import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Modal, Button } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment, addComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
    addComment: (dishId, rating, comment, author) => dispatch(addComment(dishId, rating, comment, author))
});

function RenderDish({ dish, favorite, markFavorite, openCommentForm }) { 
    
    if (dish != null) {
        return (
            <Card
                featuredTitle={dish.name}
                image={{ uri: baseUrl + dish.image }}
            >
                <Text style={{margin: 10}}>
                    {dish.description}
                </Text>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Icon 
                        raised
                        reverse
                        name={ favorite ? 'heart' : 'heart-o' }
                        type='font-awesome'
                        color='#f50'
                        onPress={() => favorite ? alert('Already added to your favorites.') : markFavorite()}
                    />
                    <Icon 
                        raised
                        reverse
                        name='pencil'
                        type='font-awesome'
                        color='#512DA8'
                        onPress={() => openCommentForm()}
                    />
                </View>
            </Card>
        );
    }
    else {
        return (<View></View>);
    }
}

function RenderComments({comments}) {
        
    const renderCommentItem = ({ item, index }) => {
        return (
            <View key={index} style={{margin: 10}}>
                <Text size={{fontSize: 14}}>{item.comment}</Text>
                <Rating
                    imageSize={20}
                    readonly
                    startingValue={item.rating}
                    style={{ alignItems: "flex-start" }}
                />
                <Text size={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date}</Text>
            </View>
        );
    }
    
    if (comments != null) {
        return(
            <Card title="Comments" >
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        );
    }
    else {
        return(<View></View>);
    }
}
    
class Dishdetail extends Component {
    
    constructor(props) {
        super(props);
        this.state = this.defaultState();
    }
        
    defaultState() {
        return({
            rating: 3,
            author: '',
            comment: '',
            showCommentForm: false
        });
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }
    
    resetCommentForm() {
        this.setState(this.defaultState());
    }

    handleComment(dishId) {
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
        this.resetCommentForm();
    }

    openCommentForm() {
        this.setState({showCommentForm: true});
    }

    setRating(rating) {
        this.setState({rating});
    }

    setAuthor(author) {
        this.setState({author});
    }

    setComment(comment) {
        this.setState({comment});
    }
    
    render() {
        const dishId = this.props.route.params.dishId;
        
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]} 
                    favorite={this.props.favorites.some(el => el === dishId)}
                    markFavorite={() => this.markFavorite(dishId)}
                    openCommentForm={() => this.openCommentForm()} 
                />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showCommentForm}
                    onDismiss={() => {this.resetCommentForm()}}
                    onRequestClose={() => {this.resetCommentForm()}}
                >
                    <View style={styles.modal}>
                        <Rating 
                            minValue={1}
                            startingValue={3}
                            fractions={0}
                            showRating={true}
                            onFinishRating={(rating) => this.setRating(rating)}
                        />
                        <Input 
                            placeholder=" Author"
                            leftIcon={
                                <Icon 
                                    name='user-o'
                                    type='font-awesome'
                                />
                            }
                            onChangeText={(author) => this.setAuthor(author)}
                        />
                        <Input 
                            placeholder=" Comment"
                            leftIcon={
                                <Icon 
                                    name='comment-o'
                                    type='font-awesome'
                                />
                            }
                            onChangeText={(comment) => this.setComment(comment)}
                        />   
                        <View style={{margin: 20}}>
                            <Button
                                onPress={() => {this.handleComment(dishId)}}
                                color='#512DA8'
                                title='SUBMIT'
                            />
                        </View>
                        <View style={{margin: 20}}>
                            <Button
                                onPress={() => {this.resetCommentForm()}}
                                color='#6c757d'
                                title='CANCEL'
                            />
                        </View>
                    </View>
                </Modal>
                <RenderComments 
                    comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({

    modal: {
        justifyContent: 'center',
        margin: 20,
    }
    
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
