// This is an example of to protect an API route
import { getSession } from "next-auth/react"
import type { NextApiRequest, NextApiResponse } from "next"
import { Expense, ExpenseStore } from './types';

async function saveExpense(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const session = await getSession({ req })
    if (session) {
        let newExpense = new Expense(req.body);
        res.status(200).json(ExpenseStore.getInstance().push(newExpense));
    } else {
        res.send({
            error: "You must be signed in to view the protected content on this page.",
        })
    }
}

export default saveExpense;
