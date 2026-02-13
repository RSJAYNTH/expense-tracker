# Deployment Setup Guide (Docker)

To enable automatic deployment to your Ubuntu server using Docker, follow these steps.

## GitHub Secrets

Configure the following **Secrets** in your GitHub repository settings (**Settings** > **Secrets and variables** > **Actions**):

| Secret Name | Description | Example Value |
| :--- | :--- | :--- |
| `HOST` | The public IP address of your Ubuntu server. | `192.168.1.100` |
| `USERNAME` | The username you use to SSH into the server. | `ubuntu` or `root` |
| `KEY` | The private SSH key content. Open your `.pem` file and copy the entire content. | `-----BEGIN RSA PRIVATE KEY----- ...` |
| `PORT` | The SSH port. Default is usually `22`. | `22` |

## Server Prerequisites

Ensure your Ubuntu server has **Docker** and **Docker Compose** installed.

```bash
# Update package list
sudo apt update

# Install Docker
sudo apt install -y docker.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Install Docker Compose (plugin)
sudo apt install -y docker-compose-v2

# Add your user to the docker group (to run without sudo)
sudo usermod -aG docker $USER
# You will need to log out and back in for this to take effect!
```

## Verification

After setting up the secrets and prerequisites:
1.  Push a change to the `main` branch.
2.  Check the **Actions** tab in GitHub.
3.  Once the workflow completes, access your app at `http://<YOUR_SERVER_IP>:3000`.
