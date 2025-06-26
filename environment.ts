export class environment {
    // static apiUrl = 'http://localhost:8081/adminService/';
    // static assetUrl = 'http://localhost:8081/adminService/';
    // static webSocketUrl = 'ws://localhost:8081';
    // static webUrl: string = 'localhost:4200/';
    static production = false;
    static apiUrl = 'https://api.chaloghoome.com/adminService/';
    static assetUrl = 'https://api.chaloghoome.com/';
    static webSocketUrl = 'wss://api.chaloghoome.com/adminService/';
    static webUrl: string = 'https://chaloghoome.com/';

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    static firebaseConfig = {
        apiKey: "AIzaSyCMNjzE84F-Hvk4YDj3IFCM9NEsu42Y2xU",
        authDomain: "chaloghoome-b5833.firebaseapp.com",
        projectId: "chaloghoome-b5833",
        storageBucket: "chaloghoome-b5833.firebasestorage.app",
        messagingSenderId: "918553775992",
        appId: "1:918553775992:web:06bb6952353bce5589028d",
        measurementId: "G-CX9RCD9JPN",
        vapidKey: 'BHMXTVsBarC23U9-EWrhzC5NmjFl-cGx-oCoyqbcRXcQ4xEm7qU-S_xd2dVHDW2aqqQxfxV5wOxTMq-jL1Aybcw'
    };
}