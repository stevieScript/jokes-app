import axios from 'axios';
import React, { Component } from 'react';
import Joke from './Joke';
import './JokeList.css';

class JokeList extends Component {
	static defaultProps = { numJokesToGet: 10 };
	constructor(props) {
		super(props);
		this.state = { jokes: [] };
		this.generateNewJokes = this.generateNewJokes.bind(this);
		this.vote = this.vote.bind(this);
	}
	componentDidMount() {
		if (this.state.jokes.length === 0) this.getJokes();
	}
	async getJokes() {
		let j = [...this.state.jokes];
		let seenJokes = new Set();
		try {
			while (j.length < this.props.numJokesToGet) {
				let res = await axios.get('https://icanhazdadjoke.com', {
					headers: { Accept: 'application/json' },
				});
				let { status, ...jokeObj } = res.data;

				if (!seenJokes.has(jokeObj.id)) {
					seenJokes.add(jokeObj.id);
					j.push({ ...jokeObj, votes: 0 });
				} else {
					console.error('duplicate found!');
				}
			}
			this.setState({ jokes: j });
		} catch (e) {
			console.log(e);
		}
	}
	generateNewJokes() {
		this.setState({ jokes: [] });
	}
	vote(id, delta) {
		this.setState({
			jokes: this.state.jokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j)),
		});
	}
	render() {
		let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);

		return (
			<div className='JokeList'>
				<button
					className='JokeList-getmore'
					onClick={this.generateNewJokes}
				>
					Get New Jokes
				</button>
				{sortedJokes.map((j) => (
					<Joke
						text={j.joke}
						key={j.id}
						id={j.id}
						votes={j.votes}
						vote={this.vote}
					/>
				))}
			</div>
		);
	}
}

export default JokeList;
