import { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
//var CanvasJSReact = require('@canvasjs/react-charts');
 
// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
class StockGraph extends Component {
	constructor (props) {
		super(props)
		this.state = {
			data: this.props
		}

	}


	componentDidUpdate(prevProps) {
		// Check if the props have changed
		if (this.props !== prevProps) {
			// Update the component state with the new props
			this.setState({ data: this.props });
		}
	}

	render() {
		const findIndexByStartDate = (startDate, stockData) => {

			// console.log(startDate)
			
			for (let i = 0; i < stockData.length; i++) {
				if (stockData[i].Date.substring(0,10) === startDate) {
					return i;
				}
			}
			
			return -1;
		};
		

		let DataFormat = []
		const startDays = findIndexByStartDate(this.state.data.dateSelect.start, this.state.data.stockdata);
		const endDays = findIndexByStartDate(this.state.data.dateSelect.end, this.state.data.stockdata)

		console.log(startDays)

		
		if(startDays != -1){
			for(let i = startDays; i < endDays; i++){
				DataFormat.push({
					x: new Date(this.state.data.stockdata[i].Date.substring(0,10)),
					y: this.state.data.stockdata[i].EOD_Price
				})
			}

		}else{
			DataFormat = [{}]
		}
		

		// console.log(DataFormat)


		const options = {
			animationEnabled: true, // Enable chart animation
			animationDuration: 1000, // Set animation duration in milliseconds
			animationEasing: "easeOutQuart", // Set easing function for animation
			title: {},
			axisX: {
				labelFontColor: "darkgray",
				lineThickness: 0,
				gridThickness: 0.1,
				valueFormatString: "DD MMM Y"
			},
			axisY: {
				labelFontColor: "darkgray",
				lineThickness: 0,
				gridThickness: 0.2,
				stripLines: [{
					value: 0,
					showOnTop: true,
					color: "gray",
					thickness: 0.2
				}],
				prefix: "$"
			},
			data: [{
				yValueFormatString: "$#,###",
				xValueFormatString: "MMMM",
				type: "spline",
				lineColor: "darkorange",
				dataPoints: DataFormat
			}]
		};
		return (
		<div>
			<CanvasJSChart options = {options}
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}
 
export default StockGraph;  