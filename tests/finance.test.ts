import { describe, it, expect, beforeEach, jest } from 'vitest'
import { checkJournalBalance, validateJournalEntry, createRevenueEntry } from '@/lib/check-balance'

describe('Financial Functions', () => {
  describe('checkJournalBalance', () => {
    it('should return balanced for valid journal entry', () => {
      const lines = [
        { accountId: '1000', debit: 1000, credit: 0 },
        { accountId: '4000', debit: 0, credit: 1000 }
      ]
      
      const result = checkJournalBalance(lines)
      
      expect(result.isBalanced).toBe(true)
      expect(result.totalDebit).toBe(1000)
      expect(result.totalCredit).toBe(1000)
      expect(result.difference).toBe(0)
    })

    it('should return unbalanced for invalid journal entry', () => {
      const lines = [
        { accountId: '1000', debit: 1000, credit: 0 },
        { accountId: '4000', debit: 0, credit: 900 }
      ]
      
      const result = checkJournalBalance(lines)
      
      expect(result.isBalanced).toBe(false)
      expect(result.totalDebit).toBe(1000)
      expect(result.totalCredit).toBe(900)
      expect(result.difference).toBe(100)
      expect(result.error).toBeDefined()
    })
  })

  describe('validateJournalEntry', () => {
    it('should not throw for valid journal entry', () => {
      const lines = [
        { accountId: '1000', debit: 1000, credit: 0 },
        { accountId: '4000', debit: 0, credit: 1000 }
      ]
      
      expect(() => validateJournalEntry(lines)).not.toThrow()
    })

    it('should throw for unbalanced journal entry', () => {
      const lines = [
        { accountId: '1000', debit: 1000, credit: 0 },
        { accountId: '4000', debit: 0, credit: 900 }
      ]
      
      expect(() => validateJournalEntry(lines)).toThrow('القيد غير متوازن')
    })

    it('should throw for journal entry with less than 2 lines', () => {
      const lines = [
        { accountId: '1000', debit: 1000, credit: 0 }
      ]
      
      expect(() => validateJournalEntry(lines)).toThrow('يجب أن يحتوي القيد على سطرين على الأقل')
    })

    it('should throw for line with both debit and credit', () => {
      const lines = [
        { accountId: '1000', debit: 1000, credit: 100 },
        { accountId: '4000', debit: 0, credit: 1100 }
      ]
      
      expect(() => validateJournalEntry(lines)).toThrow('يحتوي على مدين ودائن معاً')
    })
  })

  describe('createRevenueEntry', () => {
    it('should create revenue entry with client', () => {
      const lines = createRevenueEntry(1000, '4000', 'project1', 'client1', 'phase1')
      
      expect(lines).toHaveLength(2)
      expect(lines[0]).toEqual({
        accountId: '1100', // الذمم المدينة
        debit: 1000,
        credit: 0,
        projectId: 'project1',
        clientId: 'client1',
      })
      expect(lines[1]).toEqual({
        accountId: '4000',
        debit: 0,
        credit: 1000,
        projectId: 'project1',
        phaseId: 'phase1',
      })
    })

    it('should create revenue entry without client (cash)', () => {
      const lines = createRevenueEntry(1000, '4000', 'project1')
      
      expect(lines).toHaveLength(2)
      expect(lines[0]).toEqual({
        accountId: '1000', // النقدية
        debit: 1000,
        credit: 0,
        projectId: 'project1',
      })
      expect(lines[1]).toEqual({
        accountId: '4000',
        debit: 0,
        credit: 1000,
        projectId: 'project1',
      })
    })
  })
})