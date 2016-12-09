package blog.users.repositories;

import java.util.HashMap;

import com.amazonaws.services.cognitoidentity.AmazonCognitoIdentityClient;
import com.amazonaws.services.cognitoidentity.model.GetOpenIdTokenForDeveloperIdentityRequest;
import com.amazonaws.services.cognitoidentity.model.GetOpenIdTokenForDeveloperIdentityResult;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.datamodeling.AttributeEncryptor;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig.TableNameOverride;
import com.amazonaws.services.dynamodbv2.datamodeling.encryption.providers.DirectKmsMaterialProvider;
import com.amazonaws.services.kms.AWSKMSClient;

import blog.configuration.ApplicationConfiguration;
import blog.users.models.User;

public class DynamoDBUserRepository {

    private AmazonCognitoIdentityClient cognitoClient = new AmazonCognitoIdentityClient();
    private GetOpenIdTokenForDeveloperIdentityRequest tokenRequest = new GetOpenIdTokenForDeveloperIdentityRequest();

    private DynamoDBMapper mapper;
    private String cognitoDeveloperId;
    private String cognitoIdentityPoolId;

    public DynamoDBUserRepository(ApplicationConfiguration configuration) {
        mapper = new DynamoDBMapper(new AmazonDynamoDBClient(),
                new DynamoDBMapperConfig(new TableNameOverride(configuration.getUserDynamoDBTableName())),
                new AttributeEncryptor(
                        new DirectKmsMaterialProvider(new AWSKMSClient(), configuration.getEncryptionKeyId())));
        cognitoDeveloperId = configuration.getCognitoDeveloperId();
        cognitoIdentityPoolId = configuration.getCognitoIdentityPoolId();
    }

    public User findOne(String id) {
        return findOne(new User(id));
    }

    public User findOne(User user) {
        return mapper.load(User.class, user.getEmail());
    }

    public User save(User newUser) {
        User user = null;

        if (newUser.getEmail() != null && newUser.getPassword() != null) {
            byte[] salt = PasswordUtil.getNextSalt();
            byte[] passwordHash = PasswordUtil.hash(newUser.getPassword().toCharArray(), salt);
            newUser.setPasswordHash(passwordHash);
            newUser.setPassword(null);
            newUser.setSalt(salt);

            // grab the OpenId token for the user prior to saving to DDB
            GetOpenIdTokenForDeveloperIdentityResult result = getOpenIdToken(newUser.getEmail());

            newUser.setOpenIdToken(result.getToken());
            newUser.setIdentityId(result.getIdentityId());

            // save the user
            mapper.save(newUser);

            // verify the user was saved
            user = mapper.load(User.class, newUser.getEmail());
            user.setOpenIdToken(result.getToken());
            user.setIdentityId(result.getIdentityId());
        }

        return user;
    }

    public User verify(User userUnverified) {
        User user = null;
        try {
            user = mapper.load(User.class, userUnverified.getEmail());

            if (user != null) {

                if (userUnverified.getPassword() != null && PasswordUtil.isExpectedPassword(
                        userUnverified.getPassword().toCharArray(), user.getSalt(), user.getPasswordHash())) {

                    GetOpenIdTokenForDeveloperIdentityResult result = getOpenIdToken(user.getEmail());
                    user.setOpenIdToken(result.getToken());
                    user.setIdentityId(result.getIdentityId());
                } else {
                    // return a null user since password either wasn't provided
                    // or didn't match
                    user = null;
                }
            }
        } catch (Exception e) {
            System.out.println(e.toString());
        }

        return user;
    }

    private GetOpenIdTokenForDeveloperIdentityResult getOpenIdToken(String userId) {

        tokenRequest.setIdentityPoolId(cognitoIdentityPoolId);

        HashMap<String, String> map = new HashMap<String, String>();
        map.put(cognitoDeveloperId, userId);

        tokenRequest.setLogins(map);
        tokenRequest.setTokenDuration(new Long(10001));

        return cognitoClient.getOpenIdTokenForDeveloperIdentity(tokenRequest);
    }

    public void delete(User user) {
        mapper.delete(user);
    }
}