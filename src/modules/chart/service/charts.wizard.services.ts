import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ChartsWizardServices {
    constructor(private readonly prisma: PrismaService) { }

    async stack_bar_chart() {
        const data = await this.prisma.sheet.findMany()
        return {

        }
    }

    async radar_chart() {
        return {

        }
    }
    async doughnut_pi_chart() {
        return {

        }
    }
    async heatMap_chart() {
        return {

        }
    }
    async horizontal_bar_chart() {
        return {

        }
    }
    async multi_axis_line_chart () {
        return{

        }
    }
    async area_chart () {
        return{

        }
    }
    async stack_bar_chart_horizontal () {
        return{

        }
    }
    async column_chart () {
        return{
            
        }
    }
    async pi_chart () {
        return{

        }
    }
    async doughnut_chart () {
        return{

        }
    }
    async pareto_chart () {
        return{

        }
    }
    async funnel_chart () {
        return{

        }
    }
    async scatter_chart () {
        return{

        }
    }
    async bubble_chart () {
        return{

        }
    }
    async histogram_chart () {
        return{

        }
    }
    async waterFall_chart () {
        return{

        }
    }
    async solid_gauge_chart () {
        return{

        }
    }
    async candlestick_chart () {
        return{

        }
    }
    async geography_graph_chart () {
        return{

        }
    }
    async spline_chart () {
        return{

        }
    }
}