// This is an example of to protect an API route
import { getSession } from "next-auth/react"
import type { NextApiRequest, NextApiResponse } from "next"
import { ExpenseStore } from './types';

async function getExpense(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const session = await getSession({ req })

    if (session) {
        let expenses = ExpenseStore.getInstance().store;
        res.status(200).json(expenses);
    } else {
        res.send({
            error: "You must be signed in to view the protected content on this page.",
        })
    }
}

export default getExpense;
