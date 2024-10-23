import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';
import { useFrameProcessor } from 'react-native-vision-camera';
import { scanBarcodes, BarcodeFormat, Barcode } from 'vision-camera-code-scanner';
import commonStyles from '../styles/commonStyles';
import CustomButton from '../components/CustomButton';
import axios from 'axios';
import 'react-native-reanimated';

const QrScan = () => {
    const [scanning, setScanning] = useState(false);
    const [scannedUrls, setScannedUrls] = useState([]);
    const [hasPermission, setHasPermission] = useState(false);
    const devices = useCameraDevices();
    const device = devices?.find(d => d.position === 'back');

    useEffect(() => {
        const requestCameraPermission = async () => {
            const result = await check(PERMISSIONS.ANDROID.CAMERA); // Android 권한 확인
            if (result === RESULTS.DENIED) {
                const requestResult = await request(PERMISSIONS.ANDROID.CAMERA);
                if (requestResult === RESULTS.GRANTED) {
                    setHasPermission(true);
                } else {
                    Alert.alert('권한 필요', '카메라 권한이 필요합니다.');
                }
            } else if (result === RESULTS.GRANTED) {
                setHasPermission(true);
            } else {
                Alert.alert('권한 필요', '카메라 권한이 필요합니다.');
            }
        };

        requestCameraPermission();
    }, []);

    const scanQrCode = async (data: string) => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/scan', {
                image: data,
            });

            if (response.data.status === 'success') {
                setScannedUrls(response.data.urls);
                Alert.alert('스캔 성공', `스캔한 URL: ${response.data.urls.join(', ')}`);
            } else {
                Alert.alert('스캔 실패', response.data.message);
            }
        } catch (error) {
            console.error('스캔 중 오류 발생:', error);
            Alert.alert('오류', 'QR 코드 스캔 중 오류가 발생했습니다.');
        }
    };

    const handleBarcodeScan = (qrCode: Barcode) => {
        if (typeof qrCode.content.data === 'string') {
            scanQrCode(qrCode.content.data); // 문자열인 경우에만 QR 코드 처리
        } else {
            console.log("지원되지 않는 QR 코드 형식:", qrCode.content.data);
        }
        setScanning(false);
    };
    

    const frameProcessor = useFrameProcessor((frame: any) => {
        'worklet';
        const qrCodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE]);
        if (qrCodes.length > 0) {
            qrCodes.forEach((qrCode) => handleBarcodeScan(qrCode));
        }
    }, []);

    return (
        <View style={commonStyles.container}>
            <Text style={commonStyles.header}>QR 스캔 기능</Text>
            {scanning && device ? (
                <Camera
                    style={{ flex: 1, width: '100%' }}
                    device={device}
                    isActive={scanning}
                    frameProcessor={frameProcessor}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20 }}>QR 코드를 스캔하세요!</Text>
                    </View>
                </Camera>
            ) : hasPermission ? (
                <CustomButton title="QR 코드 스캔 시작" onPress={() => setScanning(true)} />
            ) : (
                <Text>카메라 권한을 허용해야 합니다.</Text>
            )}
            {scannedUrls.length > 0 && (
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 18 }}>스캔된 URL:</Text>
                    {scannedUrls.map((url, index) => (
                        <Text key={index} style={{ marginTop: 5 }}>
                            {url}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
};

export default QrScan;
