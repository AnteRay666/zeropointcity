import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 简单的防篡改机制
const SECRET_KEY = 'ZPC_TOKEN_2024_SECURE'

// 简单哈希函数
const simpleHash = (str: string): string => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return Math.abs(hash).toString(36)
}

// 生成签名
const generateSignature = (amount: number, timestamp: number): string => {
    return simpleHash(`${SECRET_KEY}_${amount}_${timestamp}`)
}

// 验证签名
const verifySignature = (amount: number, timestamp: number, signature: string): boolean => {
    return generateSignature(amount, timestamp) === signature
}

interface TokenData {
    amount: number
    timestamp: number
    signature: string
    reliefCount?: number
    rejectCount?: number
}

const STORAGE_KEY = 'game_tokens'
const INITIAL_TOKENS = 100 // 初始猫猫币数量

export const useTokenStore = defineStore('token', () => {
    const tokens = ref(0)
    const reliefCount = ref(0)
    const rejectCount = ref(0)

    // 从 localStorage 加载并验证
    const loadTokens = () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                const data: TokenData = JSON.parse(saved)
                if (verifySignature(data.amount, data.timestamp, data.signature)) {
                    tokens.value = data.amount
                    reliefCount.value = data.reliefCount ?? 0
                    rejectCount.value = data.rejectCount ?? 0
                    return
                }
                // 签名验证失败，重置
                console.warn('Token data tampered, resetting...')
            }
        } catch {
            console.warn('Failed to load tokens, resetting...')
        }
        // 初始化或重置
        tokens.value = INITIAL_TOKENS
        reliefCount.value = 0
        rejectCount.value = 0
        saveTokens()
    }

    // 保存到 localStorage
    const saveTokens = () => {
        const timestamp = Date.now()
        const data: TokenData = {
            amount: tokens.value,
            timestamp,
            signature: generateSignature(tokens.value, timestamp),
            reliefCount: reliefCount.value,
            rejectCount: rejectCount.value
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }

    // 消费猫猫币
    const spend = (amount: number): boolean => {
        if (tokens.value >= amount) {
            tokens.value -= amount
            saveTokens()
            return true
        }
        return false
    }

    // 获得猫猫币
    const earn = (amount: number) => {
        tokens.value += amount
        saveTokens()
    }

    // 重置猫猫币（用于测试或管理）
    const reset = () => {
        tokens.value = INITIAL_TOKENS
        saveTokens()
    }

    // 检查是否有足够猫猫币
    const canAfford = (amount: number) => computed(() => tokens.value >= amount)

    // 增加救济次数
    const incrementReliefCount = () => {
        reliefCount.value++
        saveTokens()
    }

    // 增加拒绝次数
    const incrementRejectCount = () => {
        rejectCount.value++
        saveTokens()
    }

    // 初始化加载
    loadTokens()

    return {
        tokens,
        reliefCount,
        rejectCount,
        spend,
        earn,
        reset,
        canAfford,
        loadTokens,
        incrementReliefCount,
        incrementRejectCount
    }
})
