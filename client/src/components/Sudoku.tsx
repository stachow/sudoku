import * as React from "react";
import { Component } from 'react';

export default class Sudoku extends Component<any, {data: number[][]}> {

  constructor(props: any) {
    super(props);

    this.state = {
      data: [],
    };
  }

  async componentDidMount() {
    const response = await fetch('https://s5w.uk/sudoku-api');
    const responseData: number[] =  await response.json(); // [1, 2, 3, 4]

    let flatArray = responseData.map(i => i || null);

    let hwLength = Math.sqrt(flatArray.length); // 2
    let hwRange = [...Array(hwLength).keys()]; // [0, 1]
    let data = hwRange
            .map(i => flatArray.slice(i * hwLength, (i + 1) * hwLength))

    this.setState({ data });
  }

  render() {
    const rows  = [...this.state.data];

    return (
      <table>{
        rows.map(row => <tr>{
                row.map(cell => <td>{
                    cell
                }</td>)
            }</tr>
        )}</table>
    );
  }

}
