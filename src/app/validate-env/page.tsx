'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';

interface ServiceStatus {
    service: string;
    status: 'valid' | 'error' | 'warning' | 'optional' | 'not_configured';
    message: string;
    details: Record<string, any>;
}

interface ValidationResult {
    timestamp: string;
    environment: string;
    isVercel: boolean;
    overall_status: string;
    services: Record<string, ServiceStatus>;
}

export default function ValidateEnvPage() {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<ValidationResult | null>(null);
    const [error, setError] = useState<string>('');

    const fetchValidation = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/validate-env');
            const data = await res.json();
            setResult(data);
        } catch (err) {
            setError('Failed to validate environment variables');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchValidation();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'valid':
                return <CheckCircle2 className="w-6 h-6 text-green-500" />;
            case 'error':
                return <XCircle className="w-6 h-6 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
            case 'optional':
            case 'not_configured':
                return <AlertTriangle className="w-6 h-6 text-gray-400" />;
            default:
                return <AlertTriangle className="w-6 h-6 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'valid':
                return 'border-green-500/30 bg-green-500/5';
            case 'error':
                return 'border-red-500/30 bg-red-500/5';
            case 'warning':
                return 'border-yellow-500/30 bg-yellow-500/5';
            case 'optional':
            case 'not_configured':
                return 'border-gray-500/20 bg-gray-500/5';
            default:
                return 'border-gray-500/20 bg-gray-500/5';
        }
    };

    const getOverallStatusBadge = (status: string) => {
        switch (status) {
            case 'all_systems_operational':
                return (
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-500/10 border border-green-500/30">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-green-500 font-bold">All Systems Operational</span>
                    </div>
                );
            case 'working_with_warnings':
                return (
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <span className="text-yellow-500 font-bold">Working with Warnings</span>
                    </div>
                );
            case 'partial_failure':
                return (
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/30">
                        <XCircle className="w-5 h-5 text-orange-500" />
                        <span className="text-orange-500 font-bold">Partial Failure</span>
                    </div>
                );
            case 'critical_failure':
                return (
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/30">
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-500 font-bold">Critical Failure</span>
                    </div>
                );
            default:
                return (
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-500/10 border border-gray-500/30">
                        <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                        <span className="text-gray-500 font-bold">Checking...</span>
                    </div>
                );
        }
    };

    return (
        <main className="min-h-screen py-20 px-6 bg-background">
            <div className="absolute inset-0 bg-gradient-radial from-accent/3 via-transparent to-transparent"></div>

            <div className="max-w-4xl mx-auto relative">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-serif text-gold mb-4">Environment Validator</h1>
                    <p className="text-muted-foreground">Test if your environment variables are properly configured</p>
                </div>

                {/* Overall Status */}
                {result && (
                    <div className="text-center mb-8">
                        {getOverallStatusBadge(result.overall_status)}
                        <p className="text-xs text-muted-foreground mt-3">
                            Environment: {result.environment} {result.isVercel && '(Vercel)'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Last checked: {new Date(result.timestamp).toLocaleString()}
                        </p>
                    </div>
                )}

                {/* Refresh Button */}
                <div className="text-center mb-8">
                    <button
                        onClick={fetchValidation}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent/10 border border-accent/30 hover:bg-accent/20 transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span className="font-medium">Re-validate</span>
                    </button>
                </div>

                {/* Loading State */}
                {loading && !result && (
                    <div className="text-center py-20">
                        <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Testing your configuration...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="glass p-8 rounded-3xl border border-red-500/30 bg-red-500/5">
                        <p className="text-red-400 text-center">{error}</p>
                    </div>
                )}

                {/* Service Status Cards */}
                {result && (
                    <div className="space-y-4">
                        {Object.entries(result.services).map(([key, service]) => (
                            <div
                                key={key}
                                className={`glass p-6 rounded-2xl border ${getStatusColor(service.status)} transition-all`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 mt-1">
                                        {getStatusIcon(service.status)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-foreground mb-1">
                                            {service.service}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {service.message}
                                        </p>

                                        {/* Details */}
                                        {Object.keys(service.details).length > 0 && (
                                            <details className="mt-3">
                                                <summary className="text-xs text-accent cursor-pointer hover:underline">
                                                    View Details
                                                </summary>
                                                <div className="mt-3 p-4 bg-muted/30 rounded-xl">
                                                    <dl className="space-y-2">
                                                        {Object.entries(service.details).map(([k, v]) => (
                                                            <div key={k} className="flex gap-2 text-xs">
                                                                <dt className="font-mono text-muted-foreground min-w-[140px]">
                                                                    {k}:
                                                                </dt>
                                                                <dd className="font-mono text-foreground break-all">
                                                                    {typeof v === 'boolean'
                                                                        ? (v ? '✅ true' : '❌ false')
                                                                        : Array.isArray(v)
                                                                            ? v.join(', ')
                                                                            : String(v)}
                                                                </dd>
                                                            </div>
                                                        ))}
                                                    </dl>
                                                </div>
                                            </details>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Help Text */}
                <div className="mt-12 glass p-6 rounded-2xl border border-accent/10">
                    <h3 className="text-sm font-bold text-gold mb-3">Need Help?</h3>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                        <li>• <strong className="text-foreground">Critical errors</strong> mean registration won't work</li>
                        <li>• <strong className="text-foreground">Warnings</strong> mean optional features might not work</li>
                        <li>• <strong className="text-foreground">Optional</strong> services aren't required for basic functionality</li>
                        <li>• After fixing env vars in Vercel, remember to <strong className="text-accent">redeploy</strong></li>
                        <li>• See <code className="bg-muted/50 px-1.5 py-0.5 rounded">REGISTRATION_DEBUG.md</code> for detailed setup instructions</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
