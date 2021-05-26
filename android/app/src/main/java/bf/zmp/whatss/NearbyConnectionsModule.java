package bf.zmp.whatss;

import android.content.DialogInterface;
import android.app.AlertDialog;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
//import com.facebook.react.bridge.Promise;
//import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.connection.AdvertisingOptions;
import com.google.android.gms.nearby.connection.ConnectionInfo;
import com.google.android.gms.nearby.connection.ConnectionLifecycleCallback;
import com.google.android.gms.nearby.connection.ConnectionResolution;
import com.google.android.gms.nearby.connection.ConnectionsClient;
import com.google.android.gms.nearby.connection.ConnectionsStatusCodes;
import com.google.android.gms.nearby.connection.DiscoveredEndpointInfo;
import com.google.android.gms.nearby.connection.DiscoveryOptions;
import com.google.android.gms.nearby.connection.EndpointDiscoveryCallback;
import com.google.android.gms.nearby.connection.Payload;
import com.google.android.gms.nearby.connection.PayloadCallback;
import com.google.android.gms.nearby.connection.PayloadTransferUpdate;
import com.google.android.gms.nearby.connection.Strategy;
//import android.util.Log;
import android.widget.Toast;

//import java.util.Map;

import org.jetbrains.annotations.NotNull;

import static java.nio.charset.StandardCharsets.UTF_8;

public class NearbyConnectionsModule extends ReactContextBaseJavaModule {
    private static final Strategy STRATEGY = Strategy.P2P_CLUSTER;
    private final  ConnectionsClient connectionsClients; // our handle to Nearby Connections
    private final  ReactApplicationContext context;
    //Map<String, String> endpointsAndDeviceNames;
    // payload callback
    private final PayloadCallback payloadCallback = new PayloadCallback() {
        @Override
        public void onPayloadReceived(@NonNull String endpointId, @NonNull Payload payload) {

            switch (payload.getType()){
                case Payload.Type.BYTES:
                    byte[] receivedBytes = payload.asBytes();
                    String result = new String(receivedBytes, UTF_8);
                    // send an event to the react native app
                    WritableMap params = Arguments.createMap();
                    params.putString("user", endpointId);
                    params.putString("message", result);
                    sendEvent("onPayloadReceived",params);
                    //sendEvent("onPayloadReceivedCurrentEndpoint",params);
                    break;
                default:
                    showToast("Vous reçu un message de type: '" + payload.getType()+ "' non pris en charge ");
            }
        }
        @Override
        public void onPayloadTransferUpdate(@NonNull String endpointId, @NonNull PayloadTransferUpdate payloadTransferUpdate) {}
    };

    // Callback to finding other devices
    private final EndpointDiscoveryCallback endpointDiscoveryCallback = new EndpointDiscoveryCallback() {
        @Override
        public void onEndpointFound(@NonNull String endpointId, @NonNull DiscoveredEndpointInfo info) {
            // An endpoint was found. We request a connection to it.
//            Toast.makeText(context, "Endpoint found! " + endpointId, Toast.LENGTH_LONG).show();

            // send an event to the react native app
            WritableMap device = Arguments.createMap();
            device.putString("id", endpointId);
            device.putString("name", info.getEndpointName());
            device.putString("service", info.getServiceId());
            sendEvent("onEndpointFound", device);
        }

        @Override
        public void onEndpointLost(@NonNull String endpointId) {

            /* Create an event to populate the device list */
            WritableMap device = new WritableNativeMap();
            device.putString("id", endpointId);
            sendEvent("onEndpointLost", device);
        }
    };

    private  void  sendEvent(@NonNull String eventName, @NonNull WritableMap params){
        this.getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName,params);
    }

    // Callback to connection with other devices (from this point forward the API is symmetric
    private final ConnectionLifecycleCallback connectionLifecycleCallback = new ConnectionLifecycleCallback() {
        @Override
        public void onConnectionInitiated(@NonNull String endpointId, @NonNull ConnectionInfo connectionInfo) {
            showDialog(endpointId,connectionInfo);
        }

        @Override
        public void onConnectionResult(@NonNull String endpointId, @NonNull ConnectionResolution result) {
            WritableMap params = Arguments.createMap();
            switch (result.getStatus().getStatusCode()) {
                case ConnectionsStatusCodes.STATUS_OK:
                    // We're connected! Can now start sending and receiving data.
                    showToast("Votre demande a été accepté!");
                    // send an event to the react native app
                    sendEvent("RequestGranted",params);
                    break;
                case ConnectionsStatusCodes.STATUS_CONNECTION_REJECTED:
                    // The connections was rejected by one or both sides.
                    showToast("Votre demande a été rejeté!");
                    // send an event to the react native app
                    sendEvent("RequestRejected",params);
                    break;
                case ConnectionsStatusCodes.STATUS_ERROR:
                    // The connection broke before it was able to be accepted.
                    showToast("Aucun réponse de l'autre utilisateur!");
                    // send an event to the react native app
                    sendEvent("RequestError",params);
                    break;
                default:
                    // Unknown status code
                    showToast("Problème de connexion!");
                    // send an event to the react native app
                    sendEvent("RequestUnknownError",params);
            }
        }

        @Override
        public void onDisconnected(@NonNull String endpointId) {
            // We've been disconnected from this endpoint. No more data can be
            // sent or received.
//          Toast.makeText(context, "Disconnected!", Toast.LENGTH_LONG).show();
            //clearEndpointList();

            // send an event to the react native app
            connectionsClients.disconnectFromEndpoint(endpointId);
            WritableMap params = Arguments.createMap();
            params.putString("id", endpointId);
            sendEvent("onEndpointDisconnected", params);
        }
    };

    public NearbyConnectionsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
        connectionsClients = Nearby.getConnectionsClient(reactContext);
    }

    @NotNull
    @Override
    public String getName() {
        return "NearbyConnections";
    }

    // Function to use as ServiceId in the StartDiscovery and StartAdvertising functions
    private String getPackage() {
        return "bf.zmp.whatss";
    }

    @ReactMethod
    public void sendByteMessage(String message, String opponentEndpointId) {
        connectionsClients.sendPayload(opponentEndpointId, Payload.fromBytes(message.getBytes(UTF_8)));
        showToast("Message envoyé");
        WritableMap params = Arguments.createMap();
        sendEvent("onPayloadSent",params);
    }

    public  void showToast(@NonNull String message){
        Toast.makeText(context, message, Toast.LENGTH_LONG).show();
    }

    public  void showDialog(@NonNull String endpointId, @NonNull ConnectionInfo connectionInfo){
        AlertDialog.Builder alertDialog = new AlertDialog.Builder(getCurrentActivity());
        alertDialog
                .setTitle("Acceptez vous échanger avec " + connectionInfo.getEndpointName())
                .setMessage("Confirmez le code de connexion: " + connectionInfo.getAuthenticationToken())
                .setPositiveButton(
                        "Accepter",
                        (DialogInterface dialog, int which) -> {
                            // The user confirmed, so we can accept the connection.
                            connectionsClients.acceptConnection(endpointId, payloadCallback);
                            if (connectionInfo.isIncomingConnection()){
                                WritableMap params= Arguments.createMap();

                                sendEvent("ResponseGranted", params);
                            }
                        })
                .setNegativeButton(
                        "Refuser",
                        (DialogInterface dialog, int which) -> {
                            // The user canceled, so we should reject the connection.
                            connectionsClients.rejectConnection(endpointId);
                            showToast("Connexion rejetée par " + connectionInfo.getEndpointName());
                        })
                .setIcon(android.R.drawable.ic_dialog_alert)
                .show();
    }

    @ReactMethod
    public void disconnect() {
        //this.clearEndpointList();
        connectionsClients.stopDiscovery();
        connectionsClients.stopAdvertising();
        connectionsClients.stopAllEndpoints();
    }

   /* @ReactMethod
    public void getEndpointsList(Callback successCallback) {
        try {
            WritableMap map = new WritableNativeMap();
            for (Map.Entry<String, String> entry : endpointsAndDeviceNames.entrySet()) {
                map.putString(entry.getKey(), entry.getValue());
            }
            successCallback.invoke(map);

        } catch (Exception e) {
//            Toast.makeText(context, "GetEndpointList: " + e, Toast.LENGTH_LONG).show();
        }
    }*/

    //private void clearEndpointList() {}

    @ReactMethod
    public void requestConnection(String codeName, String endpointId, Callback callback) {
        connectionsClients
                .requestConnection(codeName, endpointId, connectionLifecycleCallback)
                .addOnSuccessListener(
                        (Void unused) -> {
                            // We successfully requested a connection. Now both sides must
                            // accept before the connection is established
                            //Toast.makeText(context, "Nearby connections accepted. ", Toast.LENGTH_LONG).show();

                        })
                .addOnFailureListener(
                        (Exception e) -> {
                            // Nearby connections failed to request the connection.
                            Toast.makeText(context, "Nearby connections failed to request the connection. ", Toast.LENGTH_LONG).show();
                            callback.invoke(e);
                        });
    }

    // Broadcast our presence using Nearby Connections so other players can find us
    /*
     * .startAdvertising(userNickname, serviceId, connectionCallback, advertisingOptions);
     *   - serviceId: must be uniquely to identify the app (usually it is used the app package name)
     *   - connectionCallback: function that will be call when some device request to connect with the advertiser.
     *   - advertisingOptions: informs the strategy of the communication
     * */
    @ReactMethod
    public void startAdvertising(String user, Callback failureCallback) {
        AdvertisingOptions advertisingOptions = new AdvertisingOptions.Builder().setStrategy(STRATEGY).build();
        connectionsClients
                .startAdvertising(user, getPackage(), connectionLifecycleCallback, advertisingOptions)
                .addOnSuccessListener(
                        (Void unused) -> {
                            // We are advertising!
                            Toast.makeText(context, "Vous êtes en ligne!", Toast.LENGTH_LONG).show();
                        })
                .addOnFailureListener(
                        (Exception e) -> {
                            // We are unable to advertising.
                            //Toast.makeText(context, "We are unable to Advertising!", Toast.LENGTH_LONG).show();

                            // send an event to the react native app
                            //WritableMap params = Arguments.createMap();
                            //params.putString("event", "failureAdvertising");
                            //getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            //.emit("onFailureOfAdvertisingOrDiscovering", params);
                            failureCallback.invoke(e.getMessage());
                        });
    }

    // Starts looking for other players using Nearby Connections
    /*
     * .startDiscovery(serviceId, endpointCallback, discoveryOptions);
     *   - serviceId: usually the same as the startAdvertising (app package name)
     *   - endpointCallback: function that will be called when you find some advertiser.
     *   - discoveryOptions: options of the discovery Strategy used.
     * */
    @ReactMethod
    public void startDiscovery(Callback failureCallback) {
        DiscoveryOptions discoveryOptions = new DiscoveryOptions.Builder().setStrategy(STRATEGY).build();
        connectionsClients
                .startDiscovery(getPackage(), endpointDiscoveryCallback, discoveryOptions)
                .addOnSuccessListener(
                        (Void unused) -> {
                            // We are discovering!
//                         Toast.makeText(context, "We are Discovering!", Toast.LENGTH_LONG).show();
                        })
                .addOnFailureListener(
                        (Exception e) -> {
                            // We're unable to discovering.
//               Toast.makeText(context, "We are unable to Discovering!", Toast.LENGTH_LONG).show();
                            // send an event to the react native app
                            //WritableMap params = Arguments.createMap();
                            //params.putString("event", "failureDiscovering");
                            //getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            //.emit("onFailureOfAdvertisingOrDiscovering", params);
                            failureCallback.invoke(e.getMessage());
                        });
    }
}