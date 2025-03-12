import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, User, Phone, LogIn, UserPlus } from 'lucide-react';

interface LoginFormData {
    username: string;
    password: string;
}

interface RegisterFormData {
    name: string;
    lastname: string;
    username: string;
    password: string;
    confirmPassword: string;
    phone: string;
}

interface ResetPasswordFormData {
    phoneLastFour: string;
    newPassword: string;
    confirmNewPassword: string;
}

const Login: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('login');
    const [loginData, setLoginData] = useState<LoginFormData>({
        username: '',
        password: '',
    });
    const [registerData, setRegisterData] = useState<RegisterFormData>({
        name: '',
        lastname: '',
        username: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });
    const [resetData, setResetData] = useState<ResetPasswordFormData>({
        phoneLastFour: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [error, setError] = useState<string | null>(null);

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement login logic here
        console.log('Login submitted:', loginData);
        // Reset error
        setError(null);
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation
        if (registerData.password !== registerData.confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }
        // Implement registration logic here
        console.log('Register submitted:', registerData);
        // Reset error
        setError(null);
    };

    const handleResetSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation
        if (resetData.newPassword !== resetData.confirmNewPassword) {
            setError('รหัสผ่านใหม่ไม่ตรงกัน');
            return;
        }
        // Implement password reset logic here
        console.log('Reset password submitted:', resetData);
        // Reset error
        setError(null);
        // Switch back to login tab
        setActiveTab('login');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md shadow-lg bg-white">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">ยินดีต้อนรับ</CardTitle>
                    <CardDescription className="text-center">กรุณาเข้าสู่ระบบหรือลงทะเบียน</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
                        <TabsList className="grid w-full grid-cols-2 mb-4 ">
                            <TabsTrigger value="login" className="flex items-center gap-2">
                                <LogIn className="w-4 h-4" /> เข้าสู่ระบบ
                            </TabsTrigger>
                            <TabsTrigger value="register" className="flex items-center gap-2">
                                <UserPlus className="w-4 h-4" /> ลงทะเบียน
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="space-y-4">
                            <form onSubmit={handleLoginSubmit}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">ชื่อผู้ใช้</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="username"
                                                placeholder="กรอกชื่อผู้ใช้"
                                                className="pl-10"
                                                value={loginData.username}
                                                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">รหัสผ่าน</Label>
                                            <div className="text-sm text-gray-500 cursor-pointer" onClick={() => setActiveTab('reset')}>
                                                ลืมรหัสผ่าน?
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="กรอกรหัสผ่าน"
                                                className="pl-10"
                                                value={loginData.password}
                                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full" variant="line">เข้าสู่ระบบ</Button>
                                </div>
                            </form>
                        </TabsContent>

                        <TabsContent value="register" className="space-y-4">
                            <form onSubmit={handleRegisterSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">ชื่อ</Label>
                                        <Input
                                            id="name"
                                            placeholder="กรอกชื่อ"
                                            value={registerData.name}
                                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastname">นามสกุล</Label>
                                        <Input
                                            id="lastname"
                                            placeholder="กรอกนามสกุล"
                                            value={registerData.lastname}
                                            onChange={(e) => setRegisterData({ ...registerData, lastname: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 mt-4">
                                    <Label htmlFor="reg-username">ชื่อผู้ใช้</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="reg-username"
                                            placeholder="กรอกชื่อผู้ใช้"
                                            className="pl-10"
                                            value={registerData.username}
                                            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 mt-4">
                                    <Label htmlFor="reg-password">รหัสผ่าน</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="reg-password"
                                            type="password"
                                            placeholder="กรอกรหัสผ่าน"
                                            className="pl-10"
                                            value={registerData.password}
                                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 mt-4">
                                    <Label htmlFor="confirm-password">ยืนยันรหัสผ่าน</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            placeholder="กรอกรหัสผ่านอีกครั้ง"
                                            className="pl-10"
                                            value={registerData.confirmPassword}
                                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 mt-4">
                                    <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="phone"
                                            placeholder="กรอกเบอร์โทรศัพท์"
                                            className="pl-10"
                                            value={registerData.phone}
                                            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full mt-4" variant="line">ลงทะเบียน</Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="reset" className="space-y-4">
                            <form onSubmit={handleResetSubmit}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phoneLastFour">เบอร์โทรศัพท์ 4 ตัวท้าย</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="phoneLastFour"
                                                placeholder="กรอกเบอร์โทรศัพท์ 4 ตัวท้าย"
                                                className="pl-10"
                                                maxLength={4}
                                                value={resetData.phoneLastFour}
                                                onChange={(e) => setResetData({ ...resetData, phoneLastFour: e.target.value.replace(/[^0-9]/g, '') })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">รหัสผ่านใหม่</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                placeholder="กรอกรหัสผ่านใหม่"
                                                className="pl-10"
                                                value={resetData.newPassword}
                                                onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmNewPassword">ยืนยันรหัสผ่านใหม่</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="confirmNewPassword"
                                                type="password"
                                                placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                                                className="pl-10"
                                                value={resetData.confirmNewPassword}
                                                onChange={(e) => setResetData({ ...resetData, confirmNewPassword: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="danger" className="w-full" onClick={() => setActiveTab('login')}>
                                            ยกเลิก
                                        </Button>
                                        <Button type="submit" className="w-full" variant="line">ยืนยัน</Button>
                                    </div>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>

                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center mt-2">
                    <p className="text-sm text-gray-500">
                        © 2025 ระบบลงทะเบียน
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;