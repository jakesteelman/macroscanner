import { Tables } from "./database.types"

export type USDAFood = Omit<Tables<'usda_foods'>, 'embedding'>

export type PredictionWithUSDA = Tables<'predictions'> & {
    usda_foods?: USDAFood | null
}