import { supabase } from '../supabase';

export const sendOTP = async (phone) => {
    console.log('Sending OTP to:', phone);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    console.log('here');
    if (error) throw error;
};

export const verifyOTP = async (phone, token) => {

    const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
    });
    if (error) throw error;
    return data;
};
