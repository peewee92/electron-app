// 模拟后端API实现，实际开发中替换为真实API调用

// 生成二维码Token
export const generateToken = async (): Promise<string> => {
    try {
        // 实际调用: const response = await apiClient.get('/qr-login/generate-token');
        // return response.data.token;

        // 模拟API调用
        return new Promise((resolve) => {
            setTimeout(() => {
                // 生成随机的UUID
                const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
                resolve(uuid);
            }, 1000);
        });
    } catch (error) {
        throw new Error('Failed to generate QR token');
    }
};

// 检查token状态
export const checkTokenStatus = async (token: string): Promise<{
    status: 'pending' | 'scanned' | 'confirmed' | 'expired' | 'rejected'
}> => {
    try {
        // 实际调用: const response = await apiClient.get(`/qr-login/check-token?token=${token}`);
        // return response.data;

        // 模拟API调用 - 随机返回不同状态
        return new Promise((resolve) => {
            setTimeout(() => {
                // 在10次调用中有一次成功的机会
                const isSuccess = Math.random() < 0.1;

                if (isSuccess) {
                    resolve({ status: 'confirmed' });
                } else {
                    resolve({ status: 'pending' });
                }
            }, 500);
        });
    } catch (error) {
        throw new Error('Failed to check token status');
    }
};